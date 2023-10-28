'use server';

import { z } from 'zod';
import { ComponentsService } from '~/server/domains/components';
import { newSafeAction } from '~/app/_lib/safe-server-action';
import {
    FIND_COMPONENT_QUERY_SCHEMA as findComponentSchema,
    NEW_COMPONENT_SCHEMA as createNewComponentSchema,
} from './schemas';

export const greetUser = newSafeAction(z.object({ name: z.string() }), async ({ name }) => {
    return `Hello, ${name}`;
});

const createNewComponentHandler = async (newComponent: z.infer<typeof createNewComponentSchema>) => {
    const createdComponent = await ComponentsService.create({
        ...newComponent,
        description: newComponent.description ?? '',
        html: newComponent.html ?? '',
    });

    return createdComponent;
};

export const createNewComponentServerAction = newSafeAction(createNewComponentSchema, createNewComponentHandler);
export namespace TCreateNewComponentServerAction {
    export type Action = typeof createNewComponentServerAction;
    export type Schema = typeof createNewComponentSchema;
    export type TSchema = z.infer<typeof createNewComponentSchema>;
    export type Handler = typeof createNewComponentHandler;
    export type Data = Awaited<ReturnType<typeof createNewComponentHandler>>;
}

const findComponentsHandler = async (query: z.infer<typeof findComponentSchema>) => {
    const components = await ComponentsService.find(query);
    return components;
};

export const findComponentsServerAction = newSafeAction(findComponentSchema, findComponentsHandler);
export namespace TFindComponentsServerAction {
    export type Action = typeof findComponentsServerAction;
    export type Schema = typeof findComponentSchema;
    export type TSchema = z.infer<typeof findComponentSchema>;
    export type Handler = typeof findComponentsHandler;
    export type Data = Awaited<ReturnType<typeof findComponentsHandler>>;
}
