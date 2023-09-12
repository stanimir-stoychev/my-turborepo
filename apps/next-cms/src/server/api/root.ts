import { createTRPCRouter } from '~/server/api/trpc';
import { exampleRouter } from '~/server/api/routers/example';
import { pageRouter } from '~/server/api/routers/page';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    page: pageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
