import { TPokedexRepoPokemon } from 'prisma-db';

export function PokemonMoves({ pokemon, moves }: { pokemon: TPokedexRepoPokemon; moves: any[] }) {
    return (
        <ul>
            {moves.map((move) => (
                <li key={move.id}>{move.name}</li>
            ))}
        </ul>
    );
}
