import { PokedexRepo } from 'prisma-db';
import { PokemonCard, PokemonCardsList } from '@/src/components';

export default async function Home() {
    const limit = 20;
    const { nextCursor, results } = await PokedexRepo.searchPokemon({ limit });

    return (
        <>
            <div className="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
                {results.map((pokemon) => (
                    <PokemonCard key={pokemon.name} pokemon={pokemon} />
                ))}
                <PokemonCardsList cursor={nextCursor} limit={limit} />
            </div>
        </>
    );
}
