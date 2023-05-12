import { TSearchPokemonQuery } from '../types';
import { prismaClient } from './constants';
import { PokedexRepoHelpers } from './helpers';

export const searchPokemon = async (query: TSearchPokemonQuery) => {
    const { limit = 20, cursor, name } = query;
    const where = {
        ...(name && {
            name: { contains: name },
        }),
    };

    const [total, rawResults] = await prismaClient.$transaction([
        prismaClient.pokedex_Pokemon.count({ where }),
        prismaClient.pokedex_Pokemon.findMany({
            where,
            take: limit + 1,
            ...(cursor && { cursor: { name: cursor } }),
            select: {
                name: true,
                picture: true,
                picturePalette: true,
                moves: {
                    select: {
                        name: true,
                    },
                },
                types: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    return {
        ...(rawResults.length >= limit && {
            nextCursor: rawResults.pop()!.name,
        }),
        total,
        results: rawResults.map((pokemon) =>
            PokedexRepoHelpers.toJsonPokemon({
                ...pokemon,
                moves: pokemon.moves.map((move) => move.name),
                types: pokemon.types.map((type) => type.name),
            }),
        ),
    };
};

export const getPokemonByNameOrId = async (name: number | string) => {
    const pokemon = await prismaClient.pokedex_Pokemon.findFirst({
        where: typeof name === 'number' ? { id: name } : { name },
        include: {
            species: {
                select: {
                    femaleRate: true,
                    hatchSteps: true,
                    evolvesTo: true,
                    eggGroups: {
                        select: {
                            name: true,
                        },
                    },
                    evolutionChain: {
                        include: {
                            species: {
                                select: {
                                    id: true,
                                    name: true,
                                    evolvesTo: true,
                                    pokemon: {
                                        select: {
                                            picture: true,
                                            picturePalette: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    generation: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            abilities: {
                select: {
                    name: true,
                },
            },
            moves: {
                select: {
                    name: true,
                },
            },
            types: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!pokemon) return null;
    return PokedexRepoHelpers.toJsonPokemon({
        ...pokemon,
        abilities: pokemon.abilities.map((ability) => ability.name),
        moves: pokemon.moves.map((move) => move.name),
        types: pokemon.types.map((type) => type.name),
        species: pokemon.species
            ? {
                  ...pokemon.species,
                  eggGroups: pokemon.species.eggGroups.map((eggGroup) => eggGroup.name),
                  evolvesTo: pokemon.species.evolvesTo ?? undefined,
                  generation: pokemon.species.generation?.name,
                  evolutionChain: pokemon.species.evolutionChain?.species.map(({ pokemon, ...species }) => ({
                      ...species,
                      ...pokemon,
                  })),
              }
            : undefined,
    });
};

export const getPokemonBaseStatsMarkers = (generations?: string[]) =>
    prismaClient.$transaction(async (prisma) => {
        const stats = ['attack', 'defense', 'hp', 'spAttack', 'spDefense', 'speed'] as const;
        const where = {
            ...(generations?.length && {
                where: {
                    species: {
                        generation: {
                            name: { in: generations },
                        },
                    },
                },
            }),
        };

        const findHighestStat = (stat: string) =>
            prisma.pokedex_Pokemon.findMany({
                orderBy: { [stat]: 'desc' },
                select: { [stat]: true },
                take: 1,
                ...where,
            });

        const findAverageStat = (stat: string) =>
            prisma.pokedex_Pokemon.aggregate({
                _avg: { [stat]: true },
                ...where,
            });

        const findLowestStat = (stat: string) =>
            prisma.pokedex_Pokemon.findMany({
                orderBy: { [stat]: 'asc' },
                select: { [stat]: true },
                take: 1,
                ...where,
            });

        const [highest, average, lowest] = await Promise.all([
            Promise.all(
                stats.map(async (stat) => {
                    const results = await findHighestStat(stat);
                    return { stat, results };
                }),
            ).then((resultsAsArray) => {
                return resultsAsArray.reduce((acc, { stat, results }) => {
                    return { ...acc, [stat]: results[0][stat] };
                }, {} as Record<'attack' | 'defense' | 'hp' | 'spAttack' | 'spDefense' | 'speed', number>);
            }),

            Promise.all(
                stats.map(async (stat) => {
                    const results = await findAverageStat(stat);
                    return { stat, results };
                }),
            ).then((resultsAsArray) => {
                return resultsAsArray.reduce((acc, { stat, results }) => {
                    return { ...acc, [stat]: results._avg[stat] };
                }, {} as Record<'attack' | 'defense' | 'hp' | 'spAttack' | 'spDefense' | 'speed', number>);
            }),

            Promise.all(
                stats.map(async (stat) => {
                    const results = await findLowestStat(stat);
                    return { stat, results };
                }),
            ).then((resultsAsArray) => {
                return resultsAsArray.reduce((acc, { stat, results }) => {
                    return { ...acc, [stat]: results[0][stat] };
                }, {} as Record<'attack' | 'defense' | 'hp' | 'spAttack' | 'spDefense' | 'speed', number>);
            }),
        ]);

        return {
            average,
            highest,
            lowest,
        };
    });

const fetchSpecies = async (prisma: Partial<typeof prismaClient> = prismaClient, species: string) =>
    prisma.pokedex_Species?.findFirst({
        where: { name: species },
        include: {
            pokemon: {
                select: {
                    picture: true,
                    picturePalette: true,
                },
            },
        },
    });

type TFetchedSpecies = NonNullable<Awaited<ReturnType<typeof fetchSpecies>>>;

export const getPokemonEvolutionChain = async (pokemonName: string) =>
    prismaClient.$transaction(async (prismaClient) => {
        const fetchNextEvolvesTo = async (species: string): Promise<TFetchedSpecies[]> => {
            const speciesData = await fetchSpecies(prismaClient, species);
            return [speciesData, speciesData && (await fetchNextEvolvesTo(speciesData.evolvesTo))]
                .flat()
                .filter(Boolean) as TFetchedSpecies[];
        };

        const evolutionChain = await fetchNextEvolvesTo(pokemonName);
        return evolutionChain;
    });
