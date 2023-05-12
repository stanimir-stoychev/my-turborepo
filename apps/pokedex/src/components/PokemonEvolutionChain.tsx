import { PokedexRepo, TPokedexRepoPokemon } from 'prisma-db';

export function PokemonEvolutionChain({ pokemon }: { pokemon: TPokedexRepoPokemon }) {
    return (
        <>
            {/* <pre>{JSON.stringify(evolutionChain, null, 4)}</pre> */}
            <pre>{JSON.stringify(pokemon.species?.evolutionChain ?? {}, null, 4)}</pre>
        </>
    );
}
