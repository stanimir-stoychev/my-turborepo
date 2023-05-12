import { TAbility, TEggGroup, TEvolutionChain, TGeneration, TMove, TPokemon, TSpecies, TType } from '../types';

export type TSupportedVaultEntities =
    | 'ability'
    | 'eggGroup'
    | 'generation'
    | 'move'
    | 'pokemon'
    | 'species'
    | 'type'
    | 'evolutionChain';

export abstract class PokedexClientVault {
    static readonly ability_by_name: Map<string, TAbility> = new Map();
    static readonly eggGroup_by_name: Map<string, TEggGroup> = new Map();
    static readonly generation_by_name: Map<string, TGeneration> = new Map();
    static readonly move_by_name: Map<string, TMove> = new Map();
    static readonly pokemon_by_name: Map<string, TPokemon> = new Map();
    static readonly species_by_name: Map<string, TSpecies> = new Map();
    static readonly type_by_name: Map<string, TType> = new Map();
    static readonly evolutionChain_by_name: Map<string, TEvolutionChain> = new Map();

    static readonly ability_by_id: Map<number, TAbility> = new Map();
    static readonly eggGroup_by_id: Map<number, TEggGroup> = new Map();
    static readonly generation_by_id: Map<number, TGeneration> = new Map();
    static readonly move_by_id: Map<number, TMove> = new Map();
    static readonly pokemon_by_id: Map<number, TPokemon> = new Map();
    static readonly species_by_id: Map<number, TSpecies> = new Map();
    static readonly type_by_id: Map<number, TType> = new Map();
    static readonly evolutionChain_by_id: Map<number, TEvolutionChain> = new Map();

    static readonly setEntity = <TValue extends { name: string; id: number }>(
        type: TSupportedVaultEntities,
        value: TValue,
    ) => {
        PokedexClientVault[`${type}_by_name`].set(value.name, value as any);
        PokedexClientVault[`${type}_by_id`].set(value.id, value as any);
    };

    static readonly getEntity = (type: TSupportedVaultEntities, key: number | string) => {
        if (typeof key === 'string') {
            return PokedexClientVault[`${type}_by_name`].get(key);
        }

        return PokedexClientVault[`${type}_by_id`].get(key);
    };

    static readonly deleteEntity = (type: TSupportedVaultEntities, key: number | string) => {
        const entity = PokedexClientVault.getEntity(type, key);

        if (!entity) return false;

        const anyEntity = entity as { name: string };
        PokedexClientVault[`${type}_by_name`].delete(`${anyEntity.name}`);
        PokedexClientVault[`${type}_by_id`].delete(entity.id);
        return true;
    };
}
