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
