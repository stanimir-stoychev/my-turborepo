import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import type { TPage } from '~/types';

const DEMO_PAGE: TPage = {
    id: 'this-is-a-demo-page',
    title: 'Hello World',
    description: 'This is a description',
    previewHtml: {
        children: [
            { component: 'h1', children: 'This is a heading' },
            { component: 'hr', className: 'my-2' },
            { component: 'p', children: 'This is a paragraph from the preview HTML' },
        ],
    },
    html: {
        component: 'div',
        className: 'flex flex-col gap-2',
        'data-testid': 'demo-page',
        children: [
            {
                component: 'main',
                'data-testid': 'demo-page-main',
                children: [
                    { component: 'h1', children: 'This is a heading' },
                    { component: 'hr', className: 'my-2' },
                    {
                        component: 'ul',
                        className: 'flex flex-col gap-2',
                        children: [
                            { component: 'li', children: 'This is a list item' },
                            { component: 'li', children: 'This is a list item' },
                            { component: 'li', children: 'This is a list item' },
                        ],
                    },
                ],
            },
            { component: 'div', className: 'flex-1' },
            { component: 'footer', children: 'This is a footer' },
        ],
    },
};

const DEMO_PAGES_ARR: TPage[] = Array.from({ length: 1000 }, (_, i) => ({
    ...DEMO_PAGE,
    id: `demo-page-${i}`,
    ...(i % 2 === 0 ? { image: 'https://picsum.photos/seed/picsum/800/600' } : {}),
    ...(i % 5 === 0 ? { image: '/pikachu.jpeg' } : {}),
}));

export const pageRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
            }),
        )
        .query(({ input }) => {
            return {
                title: input.title,
                description: input.description,
            };
        }),

    getPagesArray: publicProcedure
        .input(
            z
                .object({
                    page: z.number().default(1),
                    limit: z.number().default(10),
                })
                .optional(),
        )
        .query(({ input }) => {
            const { page = 1, limit = 10 } = input ?? {};

            const start = (page - 1) * limit;
            const end = start + limit;

            return DEMO_PAGES_ARR.slice(start, end);
        }),

    getPage: publicProcedure.input(z.string()).query(({ input }): TPage => {
        return {
            ...DEMO_PAGE,
            id: input,
        };
    }),
});
