import Fuse from 'fuse.js';

import { TComponent, TComponentsRepository } from './types';

const IN_MEMORY_STORAGE: TComponent[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: `Component #${index}`,
    html: `Component #${index}`,
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
        { name: 'categories', weight: 0.6, getFn: (component) => component.categories },
        { name: 'tags', weight: 0.6, getFn: (component) => component.tags },
        {
            name: 'any',
            getFn: (component) => [component.name, component.description, ...component.categories, ...component.tags],
        },
    ],
});

const getNextId = () => {
    let nextId = Math.random().toString(36).substring(2, 9);

    while (FUSE_IN_MEMORY_STORAGE.search({ id: nextId }).length > 0) {
        nextId = Math.random().toString(36).substring(2, 9);
    }

    return nextId;
};

export const ComponentsRepository: TComponentsRepository = {
    find: async (query, { limit = 10, cursor: offset = 0 } = {}) => {
        if (!query.any && !query.name && !query.description && !query.tags && !query.categories) {
            return {
                total: IN_MEMORY_STORAGE.length,
                items: [],
            };
        }

        let allItems: TComponent[] = [];

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
            items,
            previousCursor: offset,
            nextCursor: !!nextCursorComponent ? offset + limit : undefined,
        };
    },

    create: async ({ name, html, description = '', seo, categories = [], tags = [] }) => {
        const timestamp = new Date().toISOString();
        const newComponent = {
            id: getNextId(),
            createdAt: timestamp,
            updatedAt: timestamp,

            name,
            html,
            description,
            categories,
            tags,
            seo: {
                title: seo?.title || name,
                description: seo?.description || description,
            },
        };

        FUSE_IN_MEMORY_STORAGE.add(newComponent);

        return newComponent;
    },

    read: async (id) => {
        const fuseResult = FUSE_IN_MEMORY_STORAGE.search({ id });
        return fuseResult[0]?.item;
    },

    update: async ({ id, name, html, description, seo, categories, tags }) => {
        const currentState = FUSE_IN_MEMORY_STORAGE.search({ id })[0];

        if (!currentState) {
            throw new Error(`Component with id "${id}" was not found!`);
        }

        const timestamp = new Date().toISOString();
        const updatedComponent = {
            id,
            createdAt: currentState.item.createdAt,
            updatedAt: timestamp,

            name: name ?? currentState.item.name,
            html: html ?? currentState.item.html,
            description: description ?? currentState.item.description,
            categories: categories ?? currentState.item.categories,
            tags: tags ?? currentState.item.tags,
            seo: {
                title: seo?.title ?? name ?? currentState.item.seo.title,
                description: seo?.description ?? description ?? currentState.item.seo.description,
            },
        };

        FUSE_IN_MEMORY_STORAGE.removeAt(currentState.refIndex);
        FUSE_IN_MEMORY_STORAGE.add(updatedComponent);

        return updatedComponent;
    },

    delete: async (id) => {
        const currentState = FUSE_IN_MEMORY_STORAGE.search({ id })[0];

        if (!currentState) {
            return false;
        }

        FUSE_IN_MEMORY_STORAGE.removeAt(currentState.refIndex);

        return true;
    },

    total: async () => IN_MEMORY_STORAGE.length,
} as const;
