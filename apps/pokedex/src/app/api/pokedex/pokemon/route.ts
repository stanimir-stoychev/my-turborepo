import { PokedexRepo } from 'prisma-db';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (!name) {
        return new Response(JSON.stringify({ error: 'Missing name' }), {
            status: 400,
            headers: {
                'content-type': 'application/json',
            },
        });
    }

    const data = await PokedexRepo.getPokemonByNameOrId(name);

    if (!data) {
        return new Response(JSON.stringify({ error: 'Pokemon not found' }), {
            status: 404,
            headers: {
                'content-type': 'application/json',
            },
        });
    }

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
        },
    });
}
