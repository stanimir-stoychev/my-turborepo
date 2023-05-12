import { Pokedex_Pokemon as Pokemon } from '@prisma/client';
import { TPicturePalette } from '../types';

const toJsonPokemon = <T extends Partial<Pokemon>>({ picturePalette: rawPicturePalette, ...pokemon }: T) => {
    const picturePalette: TPicturePalette | undefined =
        typeof rawPicturePalette === 'string'
            ? JSON.parse(rawPicturePalette)
            : typeof rawPicturePalette === 'object'
            ? rawPicturePalette ?? undefined
            : undefined;

    return {
        ...pokemon,
        picturePalette,
    };
};

export abstract class PokedexRepoHelpers {
    static readonly toJsonPokemon = toJsonPokemon;
}
