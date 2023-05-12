import { PokedexRepo, TPokedexRepoPokemon } from 'prisma-db';

export async function PokemonBaseStats({ pokemon }: { pokemon: TPokedexRepoPokemon }) {
    const baseStatsMarkers = await PokedexRepo.getPokemonBaseStatsMarkers();
    const generationBaseStatsMarkers = pokemon.species?.generation
        ? await PokedexRepo.getPokemonBaseStatsMarkers([pokemon.species.generation])
        : undefined;

    const { format } = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
    const statsArr = [
        ['HP', 'hp'] as const,
        ['Attack', 'attack'] as const,
        ['Defense', 'defense'] as const,
        ['Sp. Atk', 'spAttack'] as const,
        ['Sp. Def', 'spDefense'] as const,
        ['Speed', 'speed'] as const,
    ] as const;

    const baseStatsArray = statsArr.map(([label, key]) => ({
        label,
        value: pokemon[key],
        highest: baseStatsMarkers.highest[key],
        offset: 10,
        avg: baseStatsMarkers.average[key],
        lowest: baseStatsMarkers.lowest[key],
    }));

    const totalStat = {
        label: 'Total',
        value: statsArr.reduce((acc, [label, key]) => acc + pokemon[key], 0),
        highest: Object.values(baseStatsMarkers.highest).reduce((acc, stat) => acc + stat, 0),
        offset: 60,
        avg: Object.values(baseStatsMarkers.average).reduce((acc, stat) => acc + stat, 0),
        lowest: Object.values(baseStatsMarkers.lowest).reduce((acc, stat) => acc + stat, 0),
    };

    return (
        <section className="flex flex-col gap-y-2">
            {[...baseStatsArray, totalStat].map((stat) => (
                <div
                    key={stat.label}
                    className="flex items-baseline tooltip gap-x-2"
                    data-tip={`Highest: ${stat.highest}, Avg: ${format(stat.avg)}, Lowest: ${format(stat.lowest)}`}
                >
                    <span className="flex-grow-0 text-start flex-1/3">{stat.label}</span>
                    <span className="text-lg font-semibold">{stat.value}</span>
                    <progress
                        className={`h-3 progress ${stat.value >= stat.avg ? 'progress-success' : 'progress-error'}`}
                        value={stat.value}
                        max={stat.highest + stat.offset}
                    />
                </div>
            ))}
        </section>
    );
}
