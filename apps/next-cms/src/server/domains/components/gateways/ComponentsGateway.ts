import { ComponentsService } from '../services';
import { zFindComponentQuery, zNewComponentEntity, zReadComponent, zUpdateComponentEntity } from './schemas';
import type { ZodObject, ZodType } from 'zod';
import type { TComponentsGateway } from './types';

function validateDataAgainstSchema<TSchema extends ZodObject<any> | ZodType<any>, TData>(schema: TSchema, data: TData) {
    try {
        schema.parse(data);
    } catch (error: any) {
        return error;
    }
}

export const ComponentsGateway: TComponentsGateway = {
    find: async (args) => {
        const validationError = validateDataAgainstSchema(zFindComponentQuery, args);
        if (validationError) {
            console.log('validationError', validationError);
            return {
                props: [],
                message: validationError.message,
            };
        }

        try {
            const result = await ComponentsService.find(args);
            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },

    create: async (args) => {
        const validationError = validateDataAgainstSchema(zNewComponentEntity, args);
        if (validationError) {
            console.log('validationError', validationError);
            return {
                props: [],
                message: validationError.message,
            };
        }

        try {
            const result = await ComponentsService.create({
                ...args,
                description: args.description || '',
            });

            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },

    read: async (id) => {
        const validationError = validateDataAgainstSchema(zReadComponent, id);
        if (validationError) {
            console.log('validationError', validationError);
            return {
                props: [],
                message: validationError.message,
            };
        }

        try {
            const result = await ComponentsService.read(id);
            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },

    update: async (args) => {
        const validationError = validateDataAgainstSchema(zUpdateComponentEntity, args);
        if (validationError) {
            console.log('validationError', validationError);
            return {
                props: [],
                message: validationError.message,
            };
        }

        try {
            const result = await ComponentsService.update(args);
            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },

    delete: async (id) => {
        const validationError = validateDataAgainstSchema(zReadComponent, id);
        if (validationError) {
            console.log('validationError', validationError);
            return {
                props: [],
                message: validationError.message,
            };
        }

        try {
            const result = await ComponentsService.delete(id);
            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },

    total: async () => {
        try {
            const result = await ComponentsService.total();
            return result;
        } catch (error: any) {
            return {
                props: [],
                message: error.message,
            };
        }
    },
};
