import { PokedexRepo } from 'prisma-db';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') ?? undefined;
    const cursor = url.searchParams.get('cursor') ?? undefined;
    const limit = Number(url.searchParams.get('limit')) || 20;

    const data = await PokedexRepo.searchPokemon({
        cursor,
        limit,
        name,
    });

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
        },
    });
}
