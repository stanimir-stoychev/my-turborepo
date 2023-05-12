import NextImage from 'next/image';
import NextLink from 'next/link';

import { TPokedexRepoSearchResults } from 'prisma-db';

export const PokemonCard: React.FC<{ pokemon: TPokedexRepoSearchResults['results'][0] }> = ({ pokemon }) => (
    <NextLink
        href={`/pokemon/${pokemon.name}`}
        className="relative h-48 p-4 space-y-2 prose transition-colors rounded hover:shadow-lg"
        style={{
            ...(pokemon.picturePalette?.primary && {
                background: `linear-gradient(-25deg, ${pokemon.picturePalette.primary.average.bg}, 1%, transparent)`,
                color: pokemon.picturePalette.primary.base.text,
            }),
        }}
    >
        <h3 className="block capitalize">{pokemon.name}</h3>

        {pokemon.types.map((type: string) => (
            <span key={type} className="block capitalize border-none shadow-md badge bold">
                {type}
            </span>
        ))}

        {pokemon.picture && (
            <NextImage
                className="absolute transition-transform transform scale-90 bottom-2 right-2 hover:scale-100"
                src={pokemon.picture}
                alt={pokemon.name}
                width={96}
                height={96}
            />
        )}
    </NextLink>
);

export const PokemonCardSkeletons: React.FC<{ length?: number }> = ({ length = 10 }) => (
    <>
        {Array.from({ length }, (_, index) => (
            <div key={index} className="relative h-48 p-4 space-y-2 rounded bg-neutral animate-pulse">
                <div className="w-32 h-6 rounded bg-neutral-focus" />
                <div className="w-16 h-6 rounded bg-neutral-focus" />
                <div className="w-16 h-6 rounded bg-neutral-focus" />
                <div className="absolute w-24 h-24 rounded bottom-2 right-2 bg-neutral-focus" />
            </div>
        ))}
    </>
);
