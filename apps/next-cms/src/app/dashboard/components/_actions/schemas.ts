import { z } from 'zod';

const HTML_BASE_SCHEMA = z.object({
    // id: z.string().optional(),
    // className: z.string().optional(),
    // style: z.string().optional(),
    html: z.string(),
});

const HTML_SCHEMA = HTML_BASE_SCHEMA.extend({
    html: z.union([HTML_BASE_SCHEMA, z.string(), z.array(z.union([z.string(), HTML_BASE_SCHEMA]))]),
});

export const COMPONENT_SCHEMA = z.object({
    name: z.string(),
    html: z.union([z.string(), HTML_SCHEMA, z.array(z.union([z.string(), HTML_SCHEMA]))]),
    description: z.string(),
    // categories: z.array(z.string()),
    // tags: z.array(z.string()),
    // seo: z.object({
    //     title: z.string(),
    //     description: z.string(),
    // }),
});

export const DB_COMPONENT_SCHEMA = COMPONENT_SCHEMA.extend({
    id: z.string(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
});

export const NEW_COMPONENT_SCHEMA = COMPONENT_SCHEMA.extend({
    description: z.string().optional(),
    // categories: z.array(z.string()).optional(),
    // tags: z.array(z.string()).optional(),
    // seo: z
    //     .object({
    //         title: z.string().optional(),
    //         description: z.string().optional(),
    //     })
    //     .optional(),
});

export const UPDATE_COMPONENT_SCHEMA = COMPONENT_SCHEMA.extend({
    id: z.string(),
    name: z.string().optional(),
    html: z.union([z.string(), HTML_SCHEMA, z.array(HTML_SCHEMA)]).optional(),
    description: z.string().optional(),
    // categories: z.array(z.string()).optional(),
    // tags: z.array(z.string()).optional(),
    // seo: z
    //     .object({
    //         title: z.string().optional(),
    //         description: z.string().optional(),
    //     })
    //     .optional(),
});

export const FIND_COMPONENT_QUERY_SCHEMA = z.object({
    any: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    limit: z.number().optional(),
    cursor: z.number().optional(),
    // categories: z.array(z.string()).optional(),
    // tags: z.array(z.string()).optional(),
});

export type TComponent = z.infer<typeof DB_COMPONENT_SCHEMA>;
export type TNewComponent = z.infer<typeof NEW_COMPONENT_SCHEMA>;
export type TComponentUpdate = z.infer<typeof UPDATE_COMPONENT_SCHEMA>;

export type TFindComponentQuery = z.infer<typeof FIND_COMPONENT_QUERY_SCHEMA>;
