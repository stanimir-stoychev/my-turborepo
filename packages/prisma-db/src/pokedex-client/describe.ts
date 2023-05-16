import { ChainLink } from 'pokenode-ts';
import { ArrayUtils } from 'general-utils';
import {
    TPokemon,
    TSpecies,
    TEggGroup,
    TGeneration,
    TAbility,
    TMove,
    TType,
    TPokemonStats,
    TPicturePalette,
    TEvolutionChain,
} from '../types';

import { PictureDescriptor } from './PictureDescriptor';
import { mainClient } from './constants';
import chroma from 'chroma-js';

export const describeAbility = async (name: number | string) => {
    const nodeAbility = await (typeof name === 'string'
        ? mainClient.pokemon.getAbilityByName(name)
        : mainClient.pokemon.getAbilityById(name)
    ).catch((error) => null);

    if (!nodeAbility) return null;

    const ability: TAbility = {
        id: nodeAbility.id,
        name: nodeAbility.name,
        generation: nodeAbility.generation.name,
        pokemon: nodeAbility.pokemon.map((pokemon) => pokemon.pokemon.name),
    };

    return ability;
};

export const describeEggGroup = async (name: number | string) => {
    const nodeEggGroup = await (typeof name === 'string'
        ? mainClient.pokemon.getEggGroupByName(name)
        : mainClient.pokemon.getEggGroupById(name)
    ).catch((error) => null);

    if (!nodeEggGroup) return null;

    const eggGroup: TEggGroup = {
        id: nodeEggGroup.id,
        name: nodeEggGroup.name,
        species: nodeEggGroup.pokemon_species.map((species) => species.name),
    };

    return eggGroup;
};

export const describeGeneration = async (name: number | string) => {
    const nodeGeneration = await (typeof name === 'string'
        ? mainClient.game.getGenerationByName(name)
        : mainClient.game.getGenerationById(name)
    ).catch((error) => null);

    if (!nodeGeneration) return null;

    const generation: TGeneration = {
        id: nodeGeneration.id,
        name: nodeGeneration.name,
        abilities: nodeGeneration.abilities.map((ability) => ability.name),
        moves: nodeGeneration.moves.map((move) => move.name),
        species: nodeGeneration.pokemon_species.map((species) => species.name),
        types: nodeGeneration.types.map((type) => type.name),
    };

    return generation;
};

export const describeMove = async (name: number | string) => {
    const nodeMove = await (typeof name === 'string'
        ? mainClient.move.getMoveByName(name)
        : mainClient.move.getMoveById(name)
    ).catch((error) => null);

    if (!nodeMove) return null;

    const move: TMove = {
        id: nodeMove.id,
        name: nodeMove.name,

        generation: nodeMove.generation.name,
        pokemon: nodeMove.learned_by_pokemon.map((pokemon) => pokemon.name),
        type: nodeMove.type.name,
    };

    return move;
};

export const describePokemon = async (name: number | string) => {
    const nodePokemon = await (typeof name === 'string'
        ? mainClient.pokemon.getPokemonByName(name)
        : mainClient.pokemon.getPokemonById(name)
    ).catch((error) => null);

    if (!nodePokemon) return null;

    let picturePalette: TPicturePalette | undefined = undefined;
    const picture =
        nodePokemon.sprites?.other?.['official-artwork']?.front_default ??
        nodePokemon.sprites.front_default ??
        undefined;

    if (picture) {
        picturePalette = await PictureDescriptor.getImagePalette({ src: picture }).catch((error) => {
            console.error(`Failed to get image palette (pokemon: ${nodePokemon.name}) ...`);
            console.log('\n', error, '\n');
            return undefined;
        });
    }

    const pokemon: TPokemon = {
        id: nodePokemon.id,
        name: nodePokemon.name,
        height: nodePokemon.height / 10,
        weight: nodePokemon.weight / 10,
        picture,
        picturePalette,
        species: nodePokemon.species.name,
        abilities: nodePokemon.abilities.map((ability) => ability.ability.name),
        moves: nodePokemon.moves.map((move) => move.move.name),
        types: nodePokemon.types.map((type) => type.type.name),
        ...nodePokemon.stats.reduce((acc, stat) => {
            const statName = stat.stat.name
                .replace('special', 'sp')
                .split('-')
                .map((part, index) => (!index ? part : `${part[0]?.toUpperCase()}${part.substring(1)}`))
                .join('') as keyof TPokemonStats;

            acc[statName] = stat.base_stat;
            return acc;
        }, {} as TPokemonStats),
    };

    return pokemon;
};

export const describeSpecies = async (name: number | string) => {
    const nodeSpecies = await (typeof name === 'string'
        ? mainClient.pokemon.getPokemonSpeciesByName(name)
        : mainClient.pokemon.getPokemonSpeciesById(name)
    ).catch((error) => null);

    if (!nodeSpecies) return null;

    const evolutionChainId = Number(
        nodeSpecies.evolution_chain?.url
            .split('/')
            .filter((str) => str.length)
            .pop(),
    );

    const nodeEvolutionChain = await mainClient.evolution.getEvolutionChainById(evolutionChainId).catch(() => null);

    const flattenEvolutionChain = (chain?: ChainLink): string[] => {
        if (!chain) return [];
        return [chain.species.name, ...flattenEvolutionChain(chain.evolves_to[0])];
    };

    const getEvolutionName = (chain?: ChainLink): string | undefined => {
        if (!chain) return undefined;
        if (chain.species.name === nodeSpecies.name) return chain.evolves_to[0]?.species.name;
        return getEvolutionName(chain.evolves_to[0]);
    };

    const evolvesTo = getEvolutionName(nodeEvolutionChain?.chain);

    const species: TSpecies = {
        id: nodeSpecies.id,
        name: nodeSpecies.name,
        color: nodeSpecies.color.name,
        femaleRate: nodeSpecies.gender_rate < 0 ? -1 : nodeSpecies.gender_rate / 8,
        hatchSteps: 255 * (nodeSpecies.hatch_counter + 1),

        ...(evolvesTo && { evolvesTo }),
        evolutionChainId,
        eggGroups: nodeSpecies.egg_groups.map((eggGroup) => eggGroup.name),
        generation: nodeSpecies.generation.name,
        pokemon: nodeSpecies.name,
    };

    return species;
};

export const describeEvolutionChain = async (id: number | string) => {
    const chainId = Number(id);
    const nodeEvolutionChain = await mainClient.evolution.getEvolutionChainById(chainId).catch(() => null);

    if (!nodeEvolutionChain) return null;

    const flattenEvolutionChain = (chain?: ChainLink): string[] => {
        if (!chain) return [];
        return [chain.species.name, ...flattenEvolutionChain(chain.evolves_to[0])];
    };

    const evolutionChain: TEvolutionChain = {
        id: nodeEvolutionChain.id,
        species: flattenEvolutionChain(nodeEvolutionChain.chain),
    };

    return evolutionChain;
};

export const describeType = async (name: number | string) => {
    const nodeType = await (typeof name === 'string'
        ? mainClient.pokemon.getTypeByName(name)
        : mainClient.pokemon.getTypeById(name)
    ).catch((error) => null);

    if (!nodeType) return null;

    const color = await Promise.all(
        nodeType.pokemon.map((pokemon) =>
            mainClient.pokemon
                .getPokemonSpeciesByName(pokemon.pokemon.name)
                .then(({ color }) => mainClient.pokemon.getPokemonColorByName(color.name))
                .catch(() => null),
        ),
    )
        .then(ArrayUtils.removeFalsyValues)
        .then((nodeColors) => {
            if (!nodeColors.length) return '';

            const colors = nodeColors.map((color) => color.name);
            const average = chroma.average(
                colors,
                'lch',
                colors.map(() => 1),
            );

            return average.hex();
        });

    const type: TType = {
        id: nodeType.id,
        name: nodeType.name,
        color,

        doubleDamageTo: nodeType.damage_relations.double_damage_to.map((type) => type.name),
        doubleDamageFrom: nodeType.damage_relations.double_damage_from.map((type) => type.name),
        halfDamageTo: nodeType.damage_relations.half_damage_to.map((type) => type.name),
        halfDamageFrom: nodeType.damage_relations.half_damage_from.map((type) => type.name),
        noDamageTo: nodeType.damage_relations.no_damage_to.map((type) => type.name),
        noDamageFrom: nodeType.damage_relations.no_damage_from.map((type) => type.name),

        generation: nodeType.generation.name,
        pokemon: nodeType.pokemon.map((pokemon) => pokemon.pokemon.name),
    };

    return type;
};
