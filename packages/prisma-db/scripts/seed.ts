import { PokedexClient, PokedexRepo } from '../src';

const clearDatabase = async () => {
    const deletedResults = await PokedexRepo.clearData();

    console.log(`Deleted ${deletedResults.totalAbilities} abilities.`);
    console.log(`Deleted ${deletedResults.totalEggGroups} egg groups.`);
    console.log(`Deleted ${deletedResults.totalEvolutionChains} evolution chains.`);
    console.log(`Deleted ${deletedResults.totalGenerations} generations.`);
    console.log(`Deleted ${deletedResults.totalMoves} moves.`);
    console.log(`Deleted ${deletedResults.totalPokemon} pokemon.`);
    console.log(`Deleted ${deletedResults.totalSpecies} species.`);
    console.log(`Deleted ${deletedResults.totalTypes} types.`);
};

const loadPokeData = async () => {
    const loadedData = await PokedexClient.loadGenerations(['generation-i', 'generation-ii', 'generation-iii']);

    console.log(`Loaded ${loadedData.abilities.length} abilities.`);
    console.log(`Loaded ${loadedData.eggGroups.length} egg groups.`);
    console.log(`Loaded ${loadedData.generations.length} generations.`);
    console.log(`Loaded ${loadedData.moves.length} moves.`);
    console.log(`Loaded ${loadedData.pokemon.length} pokemon.`);
    console.log(`Loaded ${loadedData.species.length} species.`);
    console.log(`Loaded ${loadedData.types.length} types.`);

    return loadedData;
};

const createEntries = async (loadedData: Awaited<ReturnType<typeof loadPokeData>>) => {
    const [
        createdAbilities,
        createdEggGroups,
        createdEvolutionChains,
        createdGenerations,
        createdTypes,
        createdMoves,
        createdPokemon,
        createdSpecies,
    ] = await PokedexRepo.prismaClient.$transaction([
        PokedexRepo.createAbilities(loadedData.abilities),
        PokedexRepo.createEggGroups(loadedData.eggGroups),
        PokedexRepo.createEvolutionChains(loadedData.evolutionChains),
        PokedexRepo.createGenerations(loadedData.generations),
        PokedexRepo.createTypes(loadedData.types),
        PokedexRepo.createMoves(loadedData.moves),
        PokedexRepo.createPokemon(loadedData.pokemon),
        PokedexRepo.createSpecies(loadedData.species),
    ]);

    console.log(`Created ${createdAbilities.count} abilities.`);
    console.log(`Created ${createdEggGroups.count} egg groups.`);
    console.log(`Created ${createdEvolutionChains.count} evolution chains.`);
    console.log(`Created ${createdGenerations.count} generations.`);
    console.log(`Created ${createdMoves.count} moves.`);
    console.log(`Created ${createdPokemon.count} pokemon.`);
    console.log(`Created ${createdSpecies.count} species.`);
    console.log(`Created ${createdTypes.count} types.`);
};

const syncEntries = async (loadedData: Awaited<ReturnType<typeof loadPokeData>>) => {
    const abilities = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.abilities,
        update: PokedexRepo.syncAbility,
    });

    const eggGroups = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.eggGroups,
        update: PokedexRepo.syncEggGroup,
    });

    const generations = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.generations,
        update: PokedexRepo.syncGeneration,
    });

    const moves = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.moves,
        update: PokedexRepo.syncMove,
    });

    const pokemon = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.pokemon,
        update: (data: any) =>
            PokedexRepo.syncPokemon(data).catch((err) => {
                console.log('Failed to sync pokemon:', data.name);
                console.error(err);
                return null;
            }),
    });

    const species = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.species,
        update: PokedexRepo.syncSpecies,
    });

    const types = await PokedexRepo.batchUpdatePromises({
        dataSource: loadedData.types,
        update: PokedexRepo.syncType,
    });

    console.log(`\nSynced ${abilities.successful.length} abilities.`);
    console.log(`Failed to sync ${abilities.failed.length} abilities.`);

    console.log(`\nSynced ${eggGroups.successful.length} egg groups.`);
    console.log(`Failed to sync ${eggGroups.failed.length} egg groups.`);

    console.log(`\nSynced ${generations.successful.length} generations.`);
    console.log(`Failed to sync ${generations.failed.length} generations.`);

    console.log(`\nSynced ${moves.successful.length} moves.`);
    console.log(`Failed to sync ${moves.failed.length} moves.`);

    console.log(`\nSynced ${pokemon.successful.length} pokemon.`);
    console.log(`Failed to sync ${pokemon.failed.length} pokemon.`);

    console.log(`\nSynced ${species.successful.length} species.`);
    console.log(`Failed to sync ${species.failed.length} species.`);

    console.log(`\nSynced ${types.successful.length} types.`);
    console.log(`Failed to sync ${types.failed.length} types.`);
};

async function main() {
    try {
        console.log('\nClearing database...\n');
        await clearDatabase();

        console.log('\nLoading generations...\n');
        const loadedData = await loadPokeData();

        console.log('\nSaving data...\n');
        await createEntries(loadedData);

        console.log('\nSynchronizing data...\n');
        await syncEntries(loadedData);

        console.log('\nDatabase has been seeded.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await PokedexRepo.prismaClient.$disconnect();
    }
}

main();
