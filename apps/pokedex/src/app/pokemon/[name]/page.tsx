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

    return (
        <>
            <PokemonSpotlight pokemon={pokemon} />
            <div
                className="container flex flex-col items-center h-full p-4 pb-0 mx-auto"
                style={{ color: pokemon.picturePalette?.primary?.base.text }}
            >
                <PokemonHero pokemon={pokemon} />
                <div className="flex flex-col gap-y-6">
                    <Tabs tabs={['About', 'Base Stats', 'Evolution', 'Moves']}>
                        <div>
                            <PokemonAbout pokemon={pokemon} />
                        </div>
                        <div>
                            {/* @ts-expect-error Async Server Component */}
                            <PokemonBaseStats pokemon={pokemon} />
                        </div>
                        <div>
                            <PokemonEvolutionChain pokemon={pokemon} />
                        </div>
                        <div>
                            {/* @ts-expect-error Async Server Component */}
                            <PokemonMoves pokemon={pokemon} />
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
