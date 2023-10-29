import { z } from 'zod';

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
        })
        .optional(),
});

type TzComponentEntity = z.infer<typeof zBaseHtmlSchema> & {
    html: (string | TzComponentEntity)[];
};

const zPartialBaseHtmlSchema = zBaseHtmlSchema.omit({ id: true, name: true }).partial();
const zComponentEntity: z.ZodType<TzComponentEntity> = zBaseHtmlSchema.extend({
    html: z.lazy(() => z.union([z.string(), zComponentEntity]).array()),
});

export type TzNewComponentEntity = z.infer<typeof zPartialBaseHtmlSchema> & {
    id: number;
    name: string;
    html: (string | TzComponentEntity)[];
};
export const zNewComponentEntity: z.ZodType<TzNewComponentEntity> = zPartialBaseHtmlSchema.extend({
    id: z.number(),
    name: z.string(),
    html: z.lazy(() => z.union([z.string(), zComponentEntity]).array()),
});

export type TzUpdateComponentEntity = z.infer<typeof zPartialBaseHtmlSchema> & {
    id: number;
    name?: string;
    html?: (string | TzComponentEntity)[];
};
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
