import chroma from 'chroma-js';

export function PokemonMoves({
    moves,
}: {
    moves: {
        name: string;
        type: {
            name: string;
            color: string;
        } | null;
    }[];
}) {
    const maxMoves = 25;

    return (
        <ul className="grid grid-cols-4 gap-2 p-0 m-0">
            {moves.map((move, index) => {
                if (index > maxMoves) return null;

                const abbr =
                    index === maxMoves
                        ? `+${moves.length - maxMoves}`
                        : move.name
                              .split('-')
                              .map((part) => part[0].toUpperCase())
                              .join('');

                const tooltip =
                    index === maxMoves
                        ? `+${moves.length - maxMoves} more moves`
                        : `${move.name
                              .split('-')
                              .map((part) => part[0].toUpperCase() + part.slice(1))
                              .join(' ')} (${move.type?.name})`;

                const backgroundColor = index === maxMoves ? undefined : move.type?.color;

                const textColor =
                    index === maxMoves || !backgroundColor
                        ? undefined
                        : chroma(backgroundColor).luminance() > 0.5
                        ? 'black'
                        : 'white';

                return (
                    <li key={move.name} className="flex items-center justify-center p-0 m-0">
                        <div className="avatar tooltip" data-tip={tooltip}>
                            <div
                                className="w-12 rounded-full text-neutral-content bg-neutral"
                                style={{
                                    background:
                                        backgroundColor &&
                                        `linear-gradient(-25deg, ${backgroundColor}, 5%, transparent)`,
                                }}
                            >
                                <span
                                    className="flex items-center justify-center w-full h-full p-2 text-xl"
                                    style={{ color: textColor }}
                                >
                                    {abbr}
                                </span>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
