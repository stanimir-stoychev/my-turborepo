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

    return (
        <>
            <PokemonSpotlight pokemon={pokemon} />
            <main
                className="container flex flex-col items-center h-full p-4 pb-0 mx-auto"
                style={{ color: pokemon.picturePalette?.primary?.base.text }}
            >
                <PokemonHero pokemon={pokemon} />
                <div className="flex flex-col p-4 pb-6 mb-6 prose rounded-lg gap-y-6 bg-neutral">
                    <Tabs tabs={['About', 'Stats', 'Evolution', 'Moves']}>
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
                            <PokemonMoves moves={pokemon.moves} />
                        </div>
                    </Tabs>
                </div>
            </main>
        </>
    );
}
