import type { TPrettify } from '~/types';
import type { TComponentEntity } from '../entities';

type TNewComponent = TPrettify<Omit<TComponentEntity, 'id' | 'createdAt' | 'updatedAt'>>;
type TComponentEntityUpdate = TPrettify<Pick<TComponentEntity, 'id'> & Partial<TComponentEntity>>;

export type TComponentsRepository = {
    find: (
        query: {
            any?: string;
            name?: string;
            categories?: string[];
            description?: string;
            tags?: string[];
        },
        queryLimiters?: {
            cursor?: number;
            limit?: number;
        },
    ) => Promise<{
        total: number;
        items: TComponentEntity[];
        previousCursor?: number;
        nextCursor?: number;
    }>;
    create: (component: TNewComponent) => Promise<TComponentEntity>;
    read: (id: TComponentEntity['id']) => Promise<TComponentEntity | undefined>;
    update: (component: TComponentEntityUpdate) => Promise<TComponentEntity>;
    delete: (id: TComponentEntity['id']) => Promise<boolean>;

    total: () => Promise<number>;
};
