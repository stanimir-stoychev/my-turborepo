import { PokedexRepo, TPokedexRepoPokemon } from 'prisma-db';

export async function PokemonMoves({ pokemon }: { pokemon: TPokedexRepoPokemon }) {
    const moves = await PokedexRepo.prismaClient.pokedex_Move.findMany({
        where: {
            name: { in: pokemon.moves.map((move) => move) },
        },
    });

    return (
        <ul>
            {moves.map((move) => (
                <li key={move.id}>{move.name}</li>
            ))}
        </ul>
    );
}
