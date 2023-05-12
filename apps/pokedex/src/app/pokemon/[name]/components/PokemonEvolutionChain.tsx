import NextImage from 'next/image';

import { TPokedexRepoPokemon } from 'prisma-db';

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
        <ul className="flex flex-col gap-y-4">
            <li>Evolution Chain</li>
            {evolutions.map((evolution, index) => (
                <li key={index} className="flex justify-evenly gap-x-4">
                    {evolution.map((pkmn, index) => {
                        if (!pkmn) return null;
                        return (
                            <>
                                {index > 0 && <div />}
                                <div key={pkmn.name}>
                                    <NextImage src={pkmn.src} alt={pkmn.src} height={96} width={96} />
                                    <span>{pkmn.name}</span>
                                </div>
                            </>
                        );
                    })}
                </li>
            ))}
        </ul>
    );
}
