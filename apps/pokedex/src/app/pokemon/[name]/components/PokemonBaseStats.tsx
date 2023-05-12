import { PokedexRepo, TPokedexRepoPokemon } from 'prisma-db';

export async function PokemonBaseStats({ pokemon }: { pokemon: TPokedexRepoPokemon }) {
    const baseStatsMarkers = await PokedexRepo.getPokemonBaseStatsMarkers();
    const generationBaseStatsMarkers = pokemon.species?.generation
        ? await PokedexRepo.getPokemonBaseStatsMarkers([pokemon.species.generation])
        : baseStatsMarkers;

    const total = pokemon.hp + pokemon.attack + pokemon.defense + pokemon.spAttack + pokemon.spDefense + pokemon.speed;
    const maxTotal =
        Object.entries(baseStatsMarkers)
            .filter(([key, value]) => !key.includes('average'))
            .map(([key, value]) => value)
            .reduce((acc, stat) => acc + stat, 0) + 60;

    const avgTotal = Object.entries(baseStatsMarkers)
        .filter(([key, value]) => key.includes('average'))
        .map(([key, value]) => value)
        .reduce((acc, stat) => acc + stat, 0);

    const maxStats = {
        hp: baseStatsMarkers.highestHp + 10,
        // hp: generationBaseStatsMarkers.highestHp + 10,
        attack: baseStatsMarkers.highestAttack + 10,
        // attack: generationBaseStatsMarkers.highestAttack + 10,
        defense: baseStatsMarkers.highestDefense + 10,
        // defense: generationBaseStatsMarkers.highestDefense + 10,
        spAttack: baseStatsMarkers.highestSpAttack + 10,
        // spAttack: generationBaseStatsMarkers.highestSpAttack + 10,
        spDefense: baseStatsMarkers.highestSpDefense + 10,
        // spDefense: generationBaseStatsMarkers.highestSpDefense + 10,
        speed: baseStatsMarkers.highestSpeed + 10,
        // speed: generationBaseStatsMarkers.highestSpeed + 10,
    };

    const stats = [
        {
            label: 'HP',
            value: pokemon.hp,
            max: maxStats.hp,
            avg: baseStatsMarkers.averageHp,
        },
        {
            label: 'Attack',
            value: pokemon.attack,
            max: maxStats.attack,
            avg: baseStatsMarkers.averageAttack,
        },
        {
            label: 'Defense',
            value: pokemon.defense,
            max: maxStats.defense,
            avg: baseStatsMarkers.averageDefense,
        },
        {
            label: 'Sp. Atk',
            value: pokemon.spAttack,
            max: maxStats.spAttack,
            avg: baseStatsMarkers.averageSpAttack,
        },
        {
            label: 'Sp. Def',
            value: pokemon.spDefense,
            max: maxStats.spDefense,
            avg: baseStatsMarkers.averageSpDefense,
        },
        {
            label: 'Speed',
            value: pokemon.speed,
            max: maxStats.speed,
            avg: baseStatsMarkers.averageSpeed,
        },
        { label: 'Total', value: total, max: maxTotal, avg: avgTotal },
    ];
    const { format } = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

    return (
        <section className="flex flex-col gap-y-2">
            {stats.map(({ label, value, max, avg }) => (
                <div
                    key={label}
                    className="flex items-baseline tooltip gap-x-2"
                    data-tip={`(Global) Max: ${max}, Avg: ${format(avg)}`}
                >
                    <span className="flex-grow-0 text-start flex-1/3">{label}</span>
                    <span className="text-lg font-semibold">{value}</span>
                    <progress
                        className={`h-3 progress ${value >= avg ? 'progress-success' : 'progress-error'}`}
                        value={value}
                        max={max}
                    />
                </div>
            ))}
        </section>
    );
}
