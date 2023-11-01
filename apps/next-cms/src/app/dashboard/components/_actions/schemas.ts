import { z } from 'zod';
import { TPrettify } from '~/types';

// TComponentEntity (domain)
const zBaseHtmlSchema = z.object({
    htmlProps: z
        .object({
            id: z.string().optional(),
            className: z.string().optional(),
            style: z.string().optional(),
            component: z.string().optional(),
        })
        .optional(),
});

type TzBaseHtmlRecursive = TPrettify<
    z.infer<typeof zBaseHtmlSchema> & {
        html: (string | TPrettify<Pick<TzBaseHtmlRecursive, 'html' | 'htmlProps'>>)[];
    }
>;

const zBaseHtmlRecursive: z.ZodType<TzBaseHtmlRecursive> = zBaseHtmlSchema.extend({
    html: z.lazy(() => z.array(z.union([z.string(), zBaseHtmlRecursive]))),
});

const zPartialBaseHtmlSchema = zBaseHtmlSchema.extend({
    id: z.number().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    html: z.lazy(() => z.array(z.union([z.string(), zBaseHtmlRecursive]))),
});

export type TzNewComponentEntity = TPrettify<
    z.infer<typeof zPartialBaseHtmlSchema> & {
        name: string;
    }
>;
export const zNewComponentEntity: z.ZodType<TzNewComponentEntity> = zPartialBaseHtmlSchema.extend({
    name: z.string(),
});

export type TzUpdateComponentEntity = TPrettify<
    Omit<z.infer<typeof zPartialBaseHtmlSchema>, 'html'> & {
        id: number;
        name?: string;
        html?: (string | TPrettify<Pick<TzBaseHtmlRecursive, 'html' | 'htmlProps'>>)[];
    }
>;
export const zUpdateComponentEntity: z.ZodType<TzUpdateComponentEntity> = zPartialBaseHtmlSchema.extend({
    id: z.number(),
    name: z.string().optional(),
    html: z.lazy(() => z.union([z.string(), zBaseHtmlRecursive]).array().optional()),
});

export const zFindComponentQuery = z.object({
    any: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    limit: z.number().optional(),
    cursor: z.number().optional(),
});
