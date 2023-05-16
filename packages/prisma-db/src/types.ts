export type TPicturePaletteColor = Record<
    'average' | 'base',
    {
        base: string;
        text: string;
        bg: string;
    }
>;

export type TPicturePalette = {
    palette: string[];
    primary?: TPicturePaletteColor;
    secondary?: TPicturePaletteColor;
    tertiary?: TPicturePaletteColor;
};

export type TSearchPokemonQuery = Partial<{
    limit: number;
    cursor: string;
    name: string;
}>;

export type TEggGroup = {
    id: number;
    name: string;

    species: string[];
};

export type TGeneration = {
    id: number;
    name: string;

    abilities: string[];
    moves: string[];
    species: string[];
    types: string[];
};

export type TSpecies = {
    id: number;
    name: string;
    color: string;
    femaleRate: number;
    hatchSteps: number;

    evolutionChainId?: number;
    evolvesTo?: string;
    generation: string;
    pokemon: string;
    eggGroups: string[];
};

export type TEvolutionChain = {
    id: number;
    species: string[];
};

export type TAbility = {
    id: number;
    name: string;

    generation: string;
    pokemon: string[];
};

export type TMove = {
    id: number;
    name: string;

    generation: string;
    pokemon: string[];
    type: string;
};

export type TPokemonStats = {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
};

export type TPokemon = TPokemonStats & {
    id: number;
    name: string;
    picture?: string;
    picturePalette?: TPicturePalette;
    height: number;
    weight: number;

    abilities: string[];
    moves: string[];
    species: string;
    types: string[];
};

export type TType = {
    id: number;
    name: string;
    color: string;

    doubleDamageTo: string[];
    doubleDamageFrom: string[];
    halfDamageTo: string[];
    halfDamageFrom: string[];
    noDamageTo: string[];
    noDamageFrom: string[];

    generation: string;
    pokemon: string[];
};
