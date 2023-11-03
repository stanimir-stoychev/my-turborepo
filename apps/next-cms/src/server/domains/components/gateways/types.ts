import { z } from 'zod';
import { zFindComponentQuery, zNewComponentEntity, zReadComponent, zUpdateComponentEntity } from './schemas';

import type { TPrettify } from '~/types';
import type { TComponentsService } from '../services';

export type TGatewayError = {
    props: string[];
    message: string;
};

export const isGatewayError = (error: any): error is TGatewayError => {
    return !!error && Array.isArray(error?.props) && typeof error?.message === 'string';
};

export type TComponentsGateway = {
    find: (
        args: z.infer<typeof zFindComponentQuery>,
    ) => Promise<TPrettify<Awaited<ReturnType<TComponentsService['find']>> | TGatewayError>>;

    create: (
        args: z.infer<typeof zNewComponentEntity>,
    ) => Promise<TPrettify<Awaited<ReturnType<TComponentsService['create']>> | TGatewayError>>;

    read: (
        id: z.infer<typeof zReadComponent>,
    ) => Promise<TPrettify<Awaited<ReturnType<TComponentsService['read']>> | TGatewayError>>;

    update: (
        args: z.infer<typeof zUpdateComponentEntity>,
    ) => Promise<TPrettify<Awaited<ReturnType<TComponentsService['update']>> | TGatewayError>>;

    delete: (
        id: z.infer<typeof zReadComponent>,
    ) => Promise<TPrettify<Awaited<ReturnType<TComponentsService['delete']>> | TGatewayError>>;

    total: () => Promise<TPrettify<Awaited<ReturnType<TComponentsService['total']>> | TGatewayError>>;
};
