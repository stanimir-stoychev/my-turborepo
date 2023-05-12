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
                                    name: true,
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

export const getPokemonBaseStatsMarkers = async (generations?: string[]) => {
    const where = {
        where: {
            species: {
                generation: {
                    name: { in: generations },
                },
            },
        },
    };

    const findHighestStat = (stat: string) =>
        prismaClient.pokedex_Pokemon.findMany({
            orderBy: { [stat]: 'desc' },
            select: { [stat]: true },
            take: 1,
            ...where,
        });

    const findAverageStat = (stat: string) =>
        prismaClient.pokedex_Pokemon.aggregate({
            _avg: { [stat]: true },
            ...where,
        });

    const [
        [{ attack: highestAttack }],
        [{ defense: highestDefense }],
        [{ hp: highestHp }],
        [{ spAttack: highestSpAttack }],
        [{ spDefense: highestSpDefense }],
        [{ speed: highestSpeed }],

        {
            _avg: { attack: averageAttack },
        },
        {
            _avg: { defense: averageDefense },
        },
        {
            _avg: { hp: averageHp },
        },
        {
            _avg: { spAttack: averageSpAttack },
        },
        {
            _avg: { spDefense: averageSpDefense },
        },
        {
            _avg: { speed: averageSpeed },
        },
    ] = await prismaClient.$transaction([
        findHighestStat('attack'),
        findHighestStat('defense'),
        findHighestStat('hp'),
        findHighestStat('spAttack'),
        findHighestStat('spDefense'),
        findHighestStat('speed'),

        findAverageStat('attack'),
        findAverageStat('defense'),
        findAverageStat('hp'),
        findAverageStat('spAttack'),
        findAverageStat('spDefense'),
        findAverageStat('speed'),
    ]);

    return {
        highestAttack: highestAttack as number,
        highestDefense: highestDefense as number,
        highestHp: highestHp as number,
        highestSpAttack: highestSpAttack as number,
        highestSpDefense: highestSpDefense as number,
        highestSpeed: highestSpeed as number,

        averageAttack: averageAttack as number,
        averageDefense: averageDefense as number,
        averageHp: averageHp as number,
        averageSpAttack: averageSpAttack as number,
        averageSpDefense: averageSpDefense as number,
        averageSpeed: averageSpeed as number,
    };
};

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
