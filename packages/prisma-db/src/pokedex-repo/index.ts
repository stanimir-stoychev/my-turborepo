import { batchUpdatePromises } from './batch';
import { prismaClient } from './constants';
import {
    getPokemonBaseStatsMarkers,
    getPokemonByNameOrId,
    getPokemonEvolutionChain,
    searchPokemon,
} from './get-pokemon';
import { syncAbility, syncEggGroup, syncGeneration, syncMove, syncPokemon, syncSpecies, syncType } from './synchronize';
import {
    createAbilities,
    createEggGroups,
    createEvolutionChains,
    createGenerations,
    createMoves,
    createPokemon,
    createSpecies,
    createTypes,
} from './create';

export abstract class PokedexRepo {
    static readonly prismaClient = prismaClient;

    static readonly searchPokemon = searchPokemon;
    static readonly getPokemonByNameOrId = getPokemonByNameOrId;
    static readonly getPokemonBaseStatsMarkers = getPokemonBaseStatsMarkers;
    static readonly getPokemonEvolutionChain = getPokemonEvolutionChain;

    static readonly syncAbility = syncAbility;
    static readonly syncEggGroup = syncEggGroup;
    static readonly syncGeneration = syncGeneration;
    static readonly syncType = syncType;
    static readonly syncMove = syncMove;
    static readonly syncSpecies = syncSpecies;
    static readonly syncPokemon = syncPokemon;

    static readonly batchUpdatePromises = batchUpdatePromises;

    static readonly createAbilities = createAbilities;
    static readonly createEggGroups = createEggGroups;
    static readonly createGenerations = createGenerations;
    static readonly createMoves = createMoves;
    static readonly createPokemon = createPokemon;
    static readonly createSpecies = createSpecies;
    static readonly createTypes = createTypes;
    static readonly createEvolutionChains = createEvolutionChains;

    static readonly clearData = async () => {
        const [
            { count: totalAbilities },
            { count: totalEggGroups },
            { count: totalGenerations },
            { count: totalMoves },
            { count: totalPokemon },
            { count: totalSpecies },
            { count: totalTypes },
            { count: totalEvolutionChains },
        ] = await prismaClient.$transaction([
            prismaClient.pokedex_Ability.deleteMany(),
            prismaClient.pokedex_EggGroup.deleteMany(),
            prismaClient.pokedex_Generation.deleteMany(),
            prismaClient.pokedex_Move.deleteMany(),
            prismaClient.pokedex_Pokemon.deleteMany(),
            prismaClient.pokedex_Species.deleteMany(),
            prismaClient.pokedex_Type.deleteMany(),
            prismaClient.pokedex_EvolutionChain.deleteMany(),
        ]);

        return {
            totalAbilities,
            totalEggGroups,
            totalEvolutionChains,
            totalGenerations,
            totalMoves,
            totalPokemon,
            totalSpecies,
            totalTypes,
        };
    };
}

export type TPokedexRepoSearchResults = Awaited<ReturnType<typeof PokedexRepo.searchPokemon>>;
export type TPokedexRepoPokemon = NonNullable<Awaited<ReturnType<typeof PokedexRepo.getPokemonByNameOrId>>>;
export type TPokedexRepoPokemonBaseStatsMarkers = NonNullable<
    Awaited<ReturnType<typeof PokedexRepo.getPokemonBaseStatsMarkers>>
>;
export type TPokedexRepoPokemonEvolutionChain = NonNullable<
    Awaited<ReturnType<typeof PokedexRepo.getPokemonEvolutionChain>>
>;
