import { PokedexRepo } from '../src';

async function main() {
    try {
        console.log('Clearing database...');
        const deletedResults = await PokedexRepo.clearData();

        console.log(`Deleted ${deletedResults.totalAbilities} abilities.`);
        console.log(`Deleted ${deletedResults.totalEggGroups} egg groups.`);
        console.log(`Deleted ${deletedResults.totalEvolutionChains} evolution chains.`);
        console.log(`Deleted ${deletedResults.totalGenerations} generations.`);
        console.log(`Deleted ${deletedResults.totalMoves} moves.`);
        console.log(`Deleted ${deletedResults.totalPokemon} pokemon.`);
        console.log(`Deleted ${deletedResults.totalSpecies} species.`);
        console.log(`Deleted ${deletedResults.totalTypes} types.`);

        console.log('Data cleared.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await PokedexRepo.prismaClient.$disconnect();
    }
}

main();
