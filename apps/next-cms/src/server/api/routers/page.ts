import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import type { TPage } from '~/types';

const DEMO_PAGE: TPage = {
    id: 'this-is-a-demo-page',
    title: 'Hello World',
    description: 'This is a description',
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

    getPage: publicProcedure.input(z.string()).query(({ input }): TPage => {
        return {
            ...DEMO_PAGE,
            id: input,
        };
    }),
});
