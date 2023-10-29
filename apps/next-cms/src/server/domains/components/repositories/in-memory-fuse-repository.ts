import Fuse from 'fuse.js';

import type { TComponentEntity } from '../entities';
import type { TComponentsRepository } from './types';

type TStoredEntity = Omit<TComponentEntity, 'id'> & {
    id: string;
};

const IN_MEMORY_STORAGE: TStoredEntity[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: `Component #${index}`,
    html: [`Component #${index}`],
    description: `Component #${index} description`,
    categories: [`Category ${index % 10}`],
    tags: [`Tag ${index % 10}`],
    seo: {
        title: `Component #${index}`,
        description: `Component #${index} description`,
    },
}));

const FUSE_IN_MEMORY_STORAGE = new Fuse(IN_MEMORY_STORAGE, {
    includeScore: true,
    keys: [
        { name: 'id', weight: 1, getFn: (component) => component.id },
        { name: 'name', weight: 0.8, getFn: (component) => component.name },
        { name: 'description', weight: 0.7, getFn: (component) => component.description },
        {
            name: 'any',
            getFn: (component) => [component.name, component.description],
        },
    ],
});

let idCounter = 0;
const getNextId = (): number => {
    idCounter += 1;
    return idCounter;
};

export const InMemoryFuseComponentsRepository: TComponentsRepository = {
    create: async (component) => {
        const timestamp = new Date().toISOString();
        const newComponent = {
            id: getNextId(),
            ...component,
        };

        FUSE_IN_MEMORY_STORAGE.add({
            ...newComponent,
            id: newComponent.id.toString(),
        });

        return newComponent;
    },

    read: async (id) => {
        const item = FUSE_IN_MEMORY_STORAGE.search({
            id: id.toString(),
        })[0]?.item;

        if (!item) return;
        return { ...item, id: parseInt(item.id, 10) };
    },

    update: async ({ id, name, html, description }) => {
        const currentState = FUSE_IN_MEMORY_STORAGE.search({
            id: id.toString(),
        })[0];

        if (!currentState) {
            throw new Error(`Component with id "${id}" was not found!`);
        }

        const updatedComponent = {
            id: id.toString(),
            name: name ?? currentState.item.name,
            html: html ?? currentState.item.html,
            description: description ?? currentState.item.description,
        };

        FUSE_IN_MEMORY_STORAGE.removeAt(currentState.refIndex);
        FUSE_IN_MEMORY_STORAGE.add(updatedComponent);

        return { ...updatedComponent, id };
    },

    delete: async (id) => {
        const currentState = FUSE_IN_MEMORY_STORAGE.search({
            id: id.toString(),
        })[0];

        if (!currentState) {
            return false;
        }

        FUSE_IN_MEMORY_STORAGE.removeAt(currentState.refIndex);

        return true;
    },

    total: async () => IN_MEMORY_STORAGE.length,

    find: async (query, { limit = 10, cursor: offset = 0 } = {}) => {
        if (!query.any && !query.name && !query.description && !query.tags && !query.categories) {
            return {
                total: IN_MEMORY_STORAGE.length,
                items: [],
            };
        }

        let allItems: TStoredEntity[] = [];

        if (!query.any) {
            allItems = FUSE_IN_MEMORY_STORAGE.search({
                $and: [
                    ...(query.name ? [{ name: query.name }] : []),
                    ...(query.description ? [{ description: query.description }] : []),
                ],
            }).map((result) => result.item);
        } else {
            if (query.any === '*') {
                allItems = IN_MEMORY_STORAGE;
            } else {
                allItems = FUSE_IN_MEMORY_STORAGE.search(query.any).map((result) => result.item);
            }
        }

        const items = allItems.slice(offset, offset + limit + 1);
        const nextCursorComponent = items[limit];

        if (nextCursorComponent) {
            // Pop the last once since we only need to know if there is a next page
            items.pop();
        }

        return {
            total: allItems.length,
            items: items.map((item) => ({ ...item, id: parseInt(item.id, 10) })),
            previousCursor: offset,
            nextCursor: !!nextCursorComponent ? offset + limit : undefined,
        };
    },
};
