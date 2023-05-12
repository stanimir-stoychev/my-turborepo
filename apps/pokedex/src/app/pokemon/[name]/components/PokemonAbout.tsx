import { TPokedexRepoPokemon } from 'prisma-db';
import { AwesomeIcon } from '@/components/AwesomeIcon';

const toUppedCase = (str: string) => str[0].toUpperCase() + str.slice(1);

export const PokemonAbout = ({ pokemon }: { pokemon: TPokedexRepoPokemon }) => {
    if (!pokemon) return null;

    const getGender = (species: TPokedexRepoPokemon['species']) => {
        if (!species?.femaleRate) return 'genderless';

        const { format } = Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
        });

        const femaleRate = format(species.femaleRate);
        const maleRate = format(1 - species.femaleRate);

        return (
            <div className="flex items-baseline gap-x-2">
                <AwesomeIcon icon="mars" className="text-blue-400" />
                <span className="mr-2">{` ${maleRate}`}</span>
                <AwesomeIcon icon="venus" className="text-pink-400" />
                {` ${femaleRate}`}
            </div>
        );
    };

    const { format: formatHeight } = Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const { format: formatWeight } = Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    });

    const basicInfo = [
        { key: 'height', label: 'Height', value: `${formatHeight(pokemon.height)} m` },
        { key: 'weight', label: 'Weight', value: `${formatWeight(pokemon.weight)} kg` },
        {
            key: 'abilities',
            label: 'Abilities',
            value: pokemon.abilities
                .map((name) => name.replace('-', ' '))
                .map(toUppedCase)
                .join(', '),
        },
    ];

    const breedingInfo = [
        { key: 'gender', label: 'Gender', value: getGender(pokemon.species) },
        {
            key: 'egg-groups',
            label: 'Egg Groups',
            value: pokemon.species?.eggGroups
                .map((name) => name.replace('-', ' '))
                .map(toUppedCase)
                .join(', '),
        },
    ];

    return (
        <>
            <section className="flex flex-col gap-y-2">
                {basicInfo.map(({ key, ...item }) => (
                    <div key={key} className="flex items-baseline">
                        <span className="flex-grow-0 flex-1/3">{item.label}</span>
                        <div className="text-lg font-semibold">{item.value}</div>
                    </div>
                ))}
            </section>

            <h1 className="mt-4 text-xl font-bold">Breeding</h1>

            <section className="flex flex-col gap-y-2">
                {breedingInfo.map(({ key, ...item }) => (
                    <div key={key} className="flex items-baseline">
                        <span className="flex-grow-0 flex-1/3">{item.label}</span>
                        <div className="text-lg font-semibold">{item.value}</div>
                    </div>
                ))}
            </section>
        </>
    );
};
