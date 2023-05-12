import NextImage from 'next/image';

import { TPokedexRepoPokemon } from 'prisma-db';
import { StringUtils } from 'general-utils';

export const PokemonSpotlight: React.FC<{ pokemon: NonNullable<TPokedexRepoPokemon> }> = ({ pokemon }) => (
    <aside
        aria-label="pokemon background (spotlight)"
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
            ...(pokemon.picturePalette?.primary && {
                background: `linear-gradient(180deg, ${pokemon.picturePalette.primary.average.bg}, 33%, transparent)`,
            }),
        }}
    />
);

export const PokemonHero: React.FC<{ pokemon: NonNullable<TPokedexRepoPokemon> }> = ({ pokemon }) => (
    <div className="space-y-4 prose text-inherit">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-2">
            <h1 className="m-0 capitalize text-inherit">{pokemon.name}</h1>
            <span className="text-inherit">{`#${StringUtils.padNumber(pokemon.id ?? 0, 3)}`}</span>
        </div>
        <div className="flex flex-wrap gap-y-2 gap-x-2">
            {pokemon?.types.map((type: string) => (
                <span key={type} className="block capitalize transition-shadow border-none badge bold">
                    {type}
                </span>
            ))}
        </div>
        <div className="flex items-center justify-center mt-12">
            {pokemon.picture && (
                <NextImage
                    className="mx-auto transition-all transform scale-90 hover:scale-100"
                    src={pokemon.picture}
                    alt={pokemon.name}
                    width={256}
                    height={256}
                />
            )}
        </div>
    </div>
);
