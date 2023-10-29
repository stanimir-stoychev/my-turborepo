'use server';

import { z } from 'zod';

import { ComponentsService } from '~/server/domains/components';
import { newSafeAction } from '~/app/_lib/safe-server-action';
import { zFindComponentQuery, zNewComponentEntity, zUpdateComponentEntity } from './schemas';

const createNewComponentHandler = async (newComponent: TCreateNewComponentServerAction.TSchema) => {
    const createdComponent = await ComponentsService.create({
        ...newComponent,
        description: newComponent.description ?? '',
    });

    return createdComponent;
};

export const createNewComponentServerAction = newSafeAction(zNewComponentEntity, createNewComponentHandler);
export namespace TCreateNewComponentServerAction {
    export type Action = typeof createNewComponentServerAction;
    export type Schema = typeof zNewComponentEntity;
    export type TSchema = z.infer<typeof zNewComponentEntity>;
    export type Handler = typeof createNewComponentHandler;
    export type Data = Awaited<ReturnType<typeof createNewComponentHandler>>;
}

const updateComponentHandler = async (newComponent: TUpdateComponentServerAction.TSchema) => {
    const createdComponent = await ComponentsService.update(newComponent);
    return createdComponent;
};

export const updateComponentServerAction = newSafeAction(zUpdateComponentEntity, updateComponentHandler);
export namespace TUpdateComponentServerAction {
    export type Action = typeof updateComponentServerAction;
    export type Schema = typeof zUpdateComponentEntity;
    export type TSchema = z.infer<typeof zUpdateComponentEntity>;
    export type Handler = typeof updateComponentHandler;
    export type Data = Awaited<ReturnType<typeof updateComponentHandler>>;
}

const findComponentsHandler = async (query: z.infer<typeof zFindComponentQuery>) => {
    const components = await ComponentsService.find(query);
    return components;
};

export const findComponentsServerAction = newSafeAction(zFindComponentQuery, findComponentsHandler);
export namespace TFindComponentsServerAction {
    export type Action = typeof findComponentsServerAction;
    export type Schema = typeof zFindComponentQuery;
    export type TSchema = z.infer<typeof zFindComponentQuery>;
    export type Handler = typeof findComponentsHandler;
    export type Data = Awaited<ReturnType<typeof findComponentsHandler>>;
}
