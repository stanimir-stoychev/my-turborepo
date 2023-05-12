'use server';

import { z } from 'zod';
import { zact } from 'zact/server';

import { PokedexRepo } from 'prisma-db';

const pokemonSearchQuery = z.object({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100),
    name: z.string().min(1).max(100),
});

export const pokemonSearchAction = zact(pokemonSearchQuery.partial())(async (searchQuery) => {
    const results = await PokedexRepo.searchPokemon(searchQuery);
    return results;
});
