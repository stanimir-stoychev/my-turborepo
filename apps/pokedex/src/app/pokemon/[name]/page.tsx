import { redirect } from 'next/navigation';

import { PokedexRepo } from 'prisma-db';
import { Tabs } from '@/components';
import {
    PokemonAbout,
    PokemonBaseStats,
    PokemonEvolutionChain,
    PokemonHero,
    PokemonMoves,
    PokemonSpotlight,
} from './components';

type PageProps = {
    params: {
        name: string;
    };
};

export default async function PokemonPage({ params }: PageProps) {
    const pokemon = await PokedexRepo.getPokemonByNameOrId(params.name);

    if (!pokemon) {
        redirect('/404');
    }

    const [overall, generation] = await Promise.all([
        PokedexRepo.getPokemonBaseStatsMarkers(),
        pokemon.species?.generation ? PokedexRepo.getPokemonBaseStatsMarkers([pokemon.species.generation]) : undefined,
    ]);

    const moves = await PokedexRepo.prismaClient.pokedex_Move.findMany({
        where: {
            name: { in: pokemon.moves.map((move) => move) },
        },
    });

    return (
        <>
            <PokemonSpotlight pokemon={pokemon} />
            <main
                className="container flex flex-col items-center h-full p-4 pb-0 mx-auto"
                style={{ color: pokemon.picturePalette?.primary?.base.text }}
            >
                <PokemonHero pokemon={pokemon} />
                <div className="flex flex-col pb-4 mb-6 gap-y-6">
                    <Tabs tabs={['About', 'Base Stats', 'Evolution', 'Moves']}>
                        <div>
                            <PokemonAbout pokemon={pokemon} />
                        </div>
                        <div>
                            <PokemonBaseStats pokemon={pokemon} stats={{ overall, generation }} />
                        </div>
                        <div>
                            <PokemonEvolutionChain pokemon={pokemon} />
                        </div>
                        <div>
                            <PokemonMoves pokemon={pokemon} moves={moves} />
                        </div>
                    </Tabs>
                </div>
            </main>
        </>
    );
}
