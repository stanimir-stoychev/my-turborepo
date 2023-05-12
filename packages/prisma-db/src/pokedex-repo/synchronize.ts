import { TAbility, TEggGroup, TEvolutionChain, TGeneration, TMove, TPokemon, TSpecies, TType } from '../types';
import { prismaClient } from './constants';

const toFindName = (name: string) => ({ name });

export const syncGeneration = (generation: TGeneration) =>
    prismaClient.pokedex_Generation.update({
        where: { id: generation.id },
        data: {
            abilities: {
                connect: generation.abilities.map(toFindName),
            },
            moves: {
                connect: generation.moves.map(toFindName),
            },
            species: {
                connect: generation.species.map(toFindName),
            },
            types: {
                connect: generation.types.map(toFindName),
            },
        },
    });

export const syncAbility = (ability: TAbility) =>
    prismaClient.pokedex_Ability.update({
        where: { id: ability.id },
        data: {
            generation: {
                connect: toFindName(ability.generation),
            },
            pokemon: {
                connect: ability.pokemon.map(toFindName),
            },
        },
    });

export const syncEggGroup = (eggGroup: TEggGroup) =>
    prismaClient.pokedex_EggGroup.update({
        where: { id: eggGroup.id },
        data: {
            species: {
                connect: eggGroup.species.map(toFindName),
            },
        },
    });

export const syncType = (type: TType) =>
    prismaClient.pokedex_Type.update({
        where: { id: type.id },
        data: {
            generation: {
                connect: toFindName(type.generation),
            },
            pokemon: {
                connect: type.pokemon.map(toFindName),
            },
            doubleDamageTo: {
                connect: type.doubleDamageTo.map(toFindName),
            },
            doubleDamageFrom: {
                connect: type.doubleDamageFrom.map(toFindName),
            },
            halfDamageTo: {
                connect: type.halfDamageTo.map(toFindName),
            },
            halfDamageFrom: {
                connect: type.halfDamageFrom.map(toFindName),
            },
            noDamageTo: {
                connect: type.noDamageTo.map(toFindName),
            },
            noDamageFrom: {
                connect: type.noDamageFrom.map(toFindName),
            },
        },
    });

export const syncMove = (move: TMove) =>
    prismaClient.pokedex_Move.update({
        where: { id: move.id },
        data: {
            generation: {
                connect: toFindName(move.generation),
            },
            pokemon: {
                connect: move.pokemon.map(toFindName),
            },
            type: {
                connect: toFindName(move.type),
            },
        },
    });

export const syncSpecies = (species: TSpecies) =>
    prismaClient.pokedex_Species.update({
        where: { id: species.id },
        data: {
            eggGroups: {
                connect: species.eggGroups.map(toFindName),
            },
            generation: {
                connect: toFindName(species.generation),
            },
            pokemon: {
                connect: toFindName(species.pokemon),
            },
            ...(typeof species.evolutionChainId === 'number' && {
                evolutionChain: {
                    connect: { id: species.evolutionChainId },
                },
            }),
        },
    });

export const syncPokemon = (pokemon: TPokemon) =>
    prismaClient.pokedex_Pokemon.update({
        where: { id: pokemon.id },
        data: {
            abilities: {
                connect: pokemon.abilities.map(toFindName),
            },
            moves: {
                connect: pokemon.moves.map(toFindName),
            },
            species: {
                connect: toFindName(pokemon.species),
            },
            types: {
                connect: pokemon.types.map(toFindName),
            },
        },
    });

export const syncEvolutionChains = (evolutionChains: TEvolutionChain[]) =>
    prismaClient.pokedex_EvolutionChain.createMany({
        data: evolutionChains.map((evolutionChain) => ({
            id: evolutionChain.id,
            species: {
                connect: evolutionChain.species.map(toFindName),
            },
        })),
    });
