import { z } from 'zod';
import { TPrettify } from '~/types';

// TComponentEntity (domain)
const zBaseHtmlSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    htmlProps: z
        .object({
            id: z.string().optional(),
            className: z.string().optional(),
            style: z.string().optional(),
            component: z.string().optional(),
        })
        .optional(),
});

type TzComponentEntity = TPrettify<
    z.infer<typeof zBaseHtmlSchema> & {
        html: (string | TPrettify<Pick<TzComponentEntity, 'html' | 'htmlProps'>>)[];
    }
>;

const zPartialBaseHtmlSchema = zBaseHtmlSchema.omit({ id: true, name: true }).partial();
const zComponentEntity: z.ZodType<TzComponentEntity> = zBaseHtmlSchema.extend({
    html: z.lazy(() => z.union([z.string(), zComponentEntity]).array()),
});

export type TzNewComponentEntity = TPrettify<
    z.infer<typeof zPartialBaseHtmlSchema> & {
        name: string;
        html: (string | TPrettify<Pick<TzNewComponentEntity, 'html' | 'htmlProps'>>)[];
    }
>;
export const zNewComponentEntity: z.ZodType<TzNewComponentEntity> = zPartialBaseHtmlSchema.extend({
    name: z.string(),
    html: z.lazy(() => z.union([z.string(), zComponentEntity]).array()),
});

export type TzUpdateComponentEntity = TPrettify<
    z.infer<typeof zPartialBaseHtmlSchema> & {
        id: number;
        name?: string;
        html?: (string | TPrettify<Pick<TzComponentEntity, 'html' | 'htmlProps'>>)[];
    }
>;
export const zUpdateComponentEntity: z.ZodType<TzUpdateComponentEntity> = zPartialBaseHtmlSchema.extend({
    id: z.number(),
    name: z.string().optional(),
    html: z.lazy(() => z.union([z.string(), zComponentEntity]).array().optional()),
});

export const zFindComponentQuery = z.object({
    any: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    limit: z.number().optional(),
    cursor: z.number().optional(),
});
