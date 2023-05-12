import { TEvolutionChain } from '../types';
import { mainClient } from './constants';
import {
    describeAbility,
    describeEggGroup,
    describeEvolutionChain,
    describeGeneration,
    describeMove,
    describePokemon,
    describeSpecies,
    describeType,
} from './describe';
import { PokedexClientVault, TSupportedVaultEntities } from './vault';

const loadAndRemoveNulls = <TKey extends number | string, TResult>(
    ids: TKey[],
    loadData: (id: TKey) => Promise<TResult | null>,
    vaultEntityType: TSupportedVaultEntities,
) =>
    Promise.all(
        ids.map(
            (id) =>
                PokedexClientVault.getEntity(vaultEntityType, id) ??
                loadData(id)
                    .then((data) => {
                        if (data) PokedexClientVault.setEntity(vaultEntityType, data as any);
                        return data;
                    })
                    .catch(() => null),
        ),
    ).then((results) => results.filter(Boolean) as TResult[]);

const reduceToUniqueStrings = (acc: Set<string>, entry: string) => {
    acc.add(entry);
    return acc;
};

export * from './vault';
export abstract class PokedexClient {
    static readonly mainClient = mainClient;

    static readonly describeAbility = describeAbility;
    static readonly describeEggGroup = describeEggGroup;
    static readonly describeGeneration = describeGeneration;
    static readonly describeMove = describeMove;
    static readonly describePokemon = describePokemon;
    static readonly describeSpecies = describeSpecies;
    static readonly describeType = describeType;
    static readonly describeEvolutionChain = describeEvolutionChain;

    static readonly loadGenerations = async (gens?: string[]) => {
        const generations = await (gens?.length
            ? Promise.resolve(gens)
            : mainClient.game.listGenerations().then(({ results }) => results.map(({ name }) => name))
        ).then((gens) => loadAndRemoveNulls(gens, describeGeneration, 'generation'));

        const flat = {
            abilities: [
                ...generations
                    .flatMap((generation) => generation.abilities)
                    .reduce(reduceToUniqueStrings, new Set<string>())
                    .values(),
            ],
            moves: [
                ...generations
                    .flatMap((generation) => generation.moves)
                    .reduce(reduceToUniqueStrings, new Set<string>())
                    .values(),
            ],
            species: [
                ...generations
                    .flatMap((generation) => generation.species)
                    .reduce(reduceToUniqueStrings, new Set<string>())
                    .values(),
            ],
            evolutionChains: [] as number[],
        };

        const [eggGroups, types, abilities, pokemon, species, moves] = await Promise.all([
            mainClient.pokemon
                .listEggGroups()
                .then(({ results }) => results.map(({ name }) => name))
                .then((eggGroups) => loadAndRemoveNulls(eggGroups, describeEggGroup, 'eggGroup')),
            mainClient.pokemon
                .listTypes()
                .then(({ results }) => results.map(({ name }) => name))
                .then((types) => loadAndRemoveNulls(types, describeType, 'type')),
            loadAndRemoveNulls(flat.abilities, describeAbility, 'ability'),
            loadAndRemoveNulls(flat.species, describePokemon, 'pokemon'),
            loadAndRemoveNulls(flat.species, describeSpecies, 'species'),
            loadAndRemoveNulls(flat.moves, describeMove, 'move'),
        ]);

        flat.evolutionChains = [
            ...species
                .reduce((acc, species) => {
                    if (typeof species.evolutionChainId === 'number') acc.add(species.evolutionChainId);
                    return acc;
                }, new Set<number>())
                .values(),
        ];

        const evolutionChains = await loadAndRemoveNulls(
            flat.evolutionChains,
            describeEvolutionChain,
            'evolutionChain',
        );

        return {
            abilities: abilities.map((ability) => ({
                ...ability,
                pokemon: ability.pokemon.filter((name) => PokedexClientVault.pokemon_by_name.has(name)),
            })),
            eggGroups: eggGroups.map((eggGroup) => ({
                ...eggGroup,
                species: eggGroup.species.filter((name) => PokedexClientVault.eggGroup_by_name.has(name)),
            })),
            generations: generations.map((generation) => ({
                ...generation,
                abilities: generation.abilities.filter((name) => PokedexClientVault.ability_by_name.has(name)),
                moves: generation.moves.filter((name) => PokedexClientVault.move_by_name.has(name)),
                species: generation.species.filter((name) => PokedexClientVault.species_by_name.has(name)),
                types: generation.types.filter((name) => PokedexClientVault.type_by_name.has(name)),
            })),
            moves: moves.map((move) => ({
                ...move,
                pokemon: move.pokemon.filter((name) => PokedexClientVault.pokemon_by_name.has(name)),
            })),
            pokemon: pokemon.map((pokemon) => ({
                ...pokemon,
                abilities: pokemon.abilities.filter((name) => PokedexClientVault.ability_by_name.has(name)),
                moves: pokemon.moves.filter((name) => PokedexClientVault.move_by_name.has(name)),
                types: pokemon.types.filter((name) => PokedexClientVault.type_by_name.has(name)),
            })),
            species: species.map((species) => ({
                ...species,
                eggGroups: species.eggGroups.filter((name) => PokedexClientVault.eggGroup_by_name.has(name)),
            })),
            types: types.map((type) => ({
                ...type,
                pokemon: type.pokemon.filter((name) => PokedexClientVault.pokemon_by_name.has(name)),
            })),
            evolutionChains: evolutionChains.map((evolutionChain) => ({
                ...evolutionChain,
                species: evolutionChain.species.filter((name) => PokedexClientVault.species_by_name.has(name)),
            })),
        };
    };
}
