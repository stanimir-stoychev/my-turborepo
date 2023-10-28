'use server';

import { z } from 'zod';
import { newSafeAction } from '~/app/_lib/safe-server-action';
import { NEW_COMPONENT_SCHEMA } from './schemas';

export const greetUser = newSafeAction(z.object({ name: z.string() }), async ({ name }) => {
    return `Hello, ${name}`;
});

export const createNewComponent = newSafeAction(NEW_COMPONENT_SCHEMA, async (newComponent) => {
    console.log('What we got at the end is this:\t', newComponent);
    return 'Hello, World!';
});

/*
export const componentsRouter = createTRPCRouter({
    total: publicProcedure.query(() => ComponentsRepository.total()),

    createMany: protectedProcedure.input(z.array(NEW_COMPONENT_SCHEMA)).mutation(async ({ input }) => {
        const promises = await Promise.allSettled(input.map(ComponentsRepository.create));
        return removeFalsyValues(promises.map((promise) => (promise.status === 'fulfilled' ? promise.value : null)));
    }),

    find: publicProcedure
        .input(QUERY_LIMITERS.extend({ query: FIND_COMPONENT_QUERY_SCHEMA }))
        .query(({ input: { query, ...limiters } }) => ComponentsRepository.find(query, limiters)),
    create: protectedProcedure.input(NEW_COMPONENT_SCHEMA).mutation(({ input }) => ComponentsRepository.create(input)),
    read: protectedProcedure.input(z.string()).query(({ input }) => ComponentsRepository.read(input)),
    update: protectedProcedure
        .input(UPDATE_COMPONENT_SCHEMA)
        .mutation(({ input }) => ComponentsRepository.update(input)),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => ComponentsRepository.delete(input.id)),
});
*/
