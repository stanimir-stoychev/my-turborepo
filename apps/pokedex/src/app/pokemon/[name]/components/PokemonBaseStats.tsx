import { TPokedexRepoPokemon, TPokedexRepoPokemonBaseStatsMarkers } from 'prisma-db';

type TPokemonBaseStatsProps = {
    pokemon: TPokedexRepoPokemon;
    stats: {
        overall: TPokedexRepoPokemonBaseStatsMarkers;
        generation?: TPokedexRepoPokemonBaseStatsMarkers;
    };
};

export function PokemonBaseStats({ pokemon, stats }: TPokemonBaseStatsProps) {
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
        highest: stats.overall.highest[key],
        offset: 10,
        avg: stats.overall.average[key],
        lowest: stats.overall.lowest[key],
    }));

    const totalStat = {
        label: 'Total',
        value: statsArr.reduce((acc, [label, key]) => acc + pokemon[key], 0),
        highest: Object.values(stats.overall.highest).reduce((acc, stat) => acc + stat, 0),
        offset: 60,
        avg: Object.values(stats.overall.average).reduce((acc, stat) => acc + stat, 0),
        lowest: Object.values(stats.overall.lowest).reduce((acc, stat) => acc + stat, 0),
    };

    return (
        <ul className="flex flex-col p-0 m-0 gap-y-2">
            {[...baseStatsArray, totalStat].map((stat) => (
                <li
                    key={stat.label}
                    className="flex items-baseline p-0 m-0 tooltip gap-x-2"
                    data-tip={`Highest: ${stat.highest}, Avg: ${format(stat.avg)}, Lowest: ${format(stat.lowest)}`}
                >
                    <span className="flex-grow-0 text-start flex-1/3">{stat.label}</span>
                    <span className="text-lg font-semibold w-14">{stat.value}</span>
                    <progress
                        className={`h-3 progress ${stat.value >= stat.avg ? 'progress-success' : 'progress-error'}`}
                        value={stat.value}
                        max={stat.highest + stat.offset}
                    />
                </li>
            ))}
        </ul>
    );
}
