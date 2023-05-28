import NextImage from 'next/image';
import NextLink from 'next/link';

import { StringUtils } from 'general-utils';
import { TPokedexRepoPokemon } from 'prisma-db';
import { AwesomeIcon } from '@/components';

export function PokemonEvolutionChain({ pokemon }: { pokemon: TPokedexRepoPokemon }) {
    const evolutionChain = pokemon.species?.evolutionChain ?? [];
    const pokemonMap = evolutionChain.reduce((acc, pkmn) => {
        acc[pkmn.name] = pkmn;
        return acc;
    }, {} as Record<string, (typeof evolutionChain)[0]>);

    const evolutions = evolutionChain
        .sort((a, b) => a.id - b.id)
        .map((pkmn) => {
            const evolvesTo = pokemonMap[pkmn?.evolvesTo ?? ''];

            return [
                { name: pkmn.name, src: pkmn.picture ?? '' },
                evolvesTo ? { name: evolvesTo.name, src: evolvesTo.picture ?? '' } : undefined,
            ] as const;
        });

    return (
        <ul className="flex flex-col p-0 m-0 gap-y-4">
            {evolutions.map((evolution, index) => (
                <li key={index} className="flex p-0 m-0 justify-evenly gap-x-4">
                    {evolution.map((pkmn, index) => {
                        if (!pkmn) return null;
                        return (
                            <>
                                {index > 0 && (
                                    <div className="flex items-center justify-center">
                                        <AwesomeIcon icon="angles-right" className="text-neutral-content" size="lg" />
                                    </div>
                                )}
                                <NextLink
                                    key={pkmn.name}
                                    href={`/pokemon/${pkmn.name}`}
                                    className="transition-all scale-90 hover:scale-100 tooltip"
                                    data-tip={StringUtils.capitalize(pkmn.name)}
                                >
                                    <NextImage src={pkmn.src} alt={pkmn.src} height={96} width={96} />
                                </NextLink>
                            </>
                        );
                    })}
                </li>
            ))}
        </ul>
    );
}
