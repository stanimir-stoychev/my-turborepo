import { Prisma } from '@prisma/client';
import { TAbility, TEggGroup, TEvolutionChain, TGeneration, TMove, TPokemon, TSpecies, TType } from '../types';
import { prismaClient } from './constants';

const defaultGenerationJson = (generation: TGeneration): Partial<Prisma.Pokedex_GenerationCreateManyInput> => ({});
export const createGenerations = (generations: TGeneration[], generateAdditionalProps = defaultGenerationJson) =>
    prismaClient.pokedex_Generation.createMany({
        data: generations.map((generation) => ({
            id: generation.id,
            name: generation.name,
            ...generateAdditionalProps(generation),
        })),
    });

const defaultAbilityJson = (ability: TAbility): Partial<Prisma.Pokedex_AbilityCreateManyInput> => ({});
export const createAbilities = (abilities: TAbility[], generateAdditionalProps = defaultAbilityJson) =>
    prismaClient.pokedex_Ability.createMany({
        data: abilities.map((ability) => ({
            id: ability.id,
            name: ability.name,
            ...generateAdditionalProps(ability),
        })),
    });

const defaultEggGroupJson = (eggGroup: TEggGroup): Partial<Prisma.Pokedex_EggGroupCreateManyInput> => ({});
export const createEggGroups = (eggGroups: TEggGroup[], generateAdditionalProps = defaultEggGroupJson) =>
    prismaClient.pokedex_EggGroup.createMany({
        data: eggGroups.map((eggGroup) => ({
            id: eggGroup.id,
            name: eggGroup.name,
            ...generateAdditionalProps(eggGroup),
        })),
    });

const defaultTypeJson = (type: TType): Partial<Prisma.Pokedex_TypeCreateManyInput> => ({});
export const createTypes = (types: TType[], generateAdditionalProps = defaultTypeJson) =>
    prismaClient.pokedex_Type.createMany({
        data: types.map((type) => ({
            id: type.id,
            name: type.name,
            ...generateAdditionalProps(type),
        })),
    });

const defaultMoveJson = (move: TMove): Partial<Prisma.Pokedex_MoveCreateManyInput> => ({});
export const createMoves = (moves: TMove[], generateAdditionalProps = defaultMoveJson) =>
    prismaClient.pokedex_Move.createMany({
        data: moves.map((move) => ({
            id: move.id,
            name: move.name,
            ...generateAdditionalProps(move),
        })),
    });

const defaultSpeciesJson = (species: TSpecies): Partial<Prisma.Pokedex_SpeciesCreateManyInput> => ({});
export const createSpecies = (species: TSpecies[], generateAdditionalProps = defaultSpeciesJson) =>
    prismaClient.pokedex_Species.createMany({
        data: species.map((species) => ({
            id: species.id,
            name: species.name,
            color: species.color,
            femaleRate: species.femaleRate,
            hatchSteps: species.hatchSteps,
            evolvesTo: species.evolvesTo,
            ...generateAdditionalProps(species),
        })),
    });

const defaultPokemonJson = (pokemon: TPokemon): Partial<Prisma.Pokedex_PokemonCreateManyInput> => ({});
export const createPokemon = (pokemon: TPokemon[], generateAdditionalProps = defaultPokemonJson) =>
    prismaClient.pokedex_Pokemon.createMany({
        data: pokemon.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            picture: pokemon.picture,
            picturePalette: pokemon.picturePalette,
            height: pokemon.height,
            weight: pokemon.weight,

            hp: pokemon.hp,
            attack: pokemon.attack,
            defense: pokemon.defense,
            spAttack: pokemon.spAttack,
            spDefense: pokemon.spDefense,
            speed: pokemon.speed,

            ...generateAdditionalProps(pokemon),
        })),
    });

const defaultEvolutionChainJson = (
    evolutionChain: TEvolutionChain,
): Partial<Prisma.Pokedex_EvolutionChainCreateManyInput> => ({});
export const createEvolutionChains = (
    evolutionChains: TEvolutionChain[],
    generateAdditionalProps = defaultEvolutionChainJson,
) =>
    prismaClient.pokedex_EvolutionChain.createMany({
        data: evolutionChains.map((evolutionChain) => ({
            id: evolutionChain.id,
            ...generateAdditionalProps(evolutionChain),
        })),
    });
