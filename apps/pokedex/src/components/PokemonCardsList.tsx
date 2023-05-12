'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { TPokedexRepoSearchResults } from 'prisma-db';
import { useIntersection } from '@/src/hooks';

import { PokemonCard } from './PokemonCard';

type PokemonCardsListProps = {
    cursor?: string;
    limit: number;
};

abstract class InfinitePokemonCache {
    private static readonly cache: Map<string, { data: TPokedexRepoSearchResults; timeoutId: NodeJS.Timeout }> =
        new Map();

    static readonly readFromCache = ({ query, timeToLive = 60 * 1000 }: { query: string; timeToLive?: number }) => {
        const { data, timeoutId } = InfinitePokemonCache.cache.get(query) ?? {};

        if (!data) return;

        if (timeoutId) {
            clearTimeout(timeoutId);
            InfinitePokemonCache.cache.set(query, {
                data,
                timeoutId: setTimeout(() => {
                    InfinitePokemonCache.cache?.delete?.(query);
                }, timeToLive),
            });
        }

        return data;
    };

    static readonly saveToCache = ({
        query,
        data,
        timeToLive = 60 * 1000,
    }: {
        query: string;
        data: TPokedexRepoSearchResults;
        timeToLive?: number;
    }) => {
        const timeoutId = setTimeout(() => {
            InfinitePokemonCache.cache?.delete?.(query);
        }, timeToLive);

        InfinitePokemonCache.cache.set(query, { data, timeoutId });
    };
}

const useInfinitePokemon = (query: PokemonCardsListProps) => {
    const [data, setData] = useState<TPokedexRepoSearchResults[]>([]);
    const [error, setError] = useState<unknown>();
    const [{ cursor, hasNextPage, isLoading }, setMetaData] = useState({
        cursor: query.cursor,
        hasNextPage: false,
        isLoading: true,
    });

    const fetchData = useCallback(() => {
        const searchParams = new URLSearchParams();
        searchParams.set('limit', `${query.limit}`);
        if (cursor) searchParams.set('cursor', `${cursor}`);

        const searchQuery = searchParams.toString();
        const updateData = (nextPage: TPokedexRepoSearchResults) => {
            setData((prevPages) => [...prevPages, nextPage]);
            setMetaData({
                cursor: nextPage.nextCursor,
                hasNextPage: !!nextPage.nextCursor,
                isLoading: false,
            });
        };

        const cachedData = InfinitePokemonCache.readFromCache({ query: searchQuery });
        if (cachedData) {
            updateData(cachedData);
            return;
        }

        setMetaData((prev) => ({ ...prev, isLoading: true }));
        fetch(`/api/pokedex/search?${searchQuery}`)
            .then(async (res) => {
                const nextPage: TPokedexRepoSearchResults = await res.json();
                InfinitePokemonCache.saveToCache({ query: searchQuery, data: nextPage });
                updateData(nextPage);
            })
            .catch(setError);
    }, [cursor, query.limit]);

    const fetchNextPage = useCallback(() => {
        if (!hasNextPage || isLoading) return;
        fetchData();
    }, [fetchData, hasNextPage, isLoading]);

    useEffectOnce(fetchData);

    return {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading,
    };
};

const LoadingSkeleton: React.FC = () => (
    <>
        {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="relative h-48 p-4 space-y-2 rounded bg-neutral animate-pulse">
                <div className="w-32 h-6 rounded bg-neutral-focus" />
                <div className="w-16 h-6 rounded bg-neutral-focus" />
                <div className="w-16 h-6 rounded bg-neutral-focus" />
                <div className="absolute w-24 h-24 rounded bottom-2 right-2 bg-neutral-focus" />
            </div>
        ))}
    </>
);

export const PokemonCardsList: React.FC<PokemonCardsListProps> = (props) => {
    const { data, isLoading, error, hasNextPage, fetchNextPage } = useInfinitePokemon(props);
    const { captureIntersectionElement, intersection } = useIntersection(useMemo(() => ({ threshold: 1 }), []));

    useEffect(() => {
        if (intersection?.isIntersecting && hasNextPage && !error) {
            fetchNextPage();
        }
    }, [intersection?.isIntersecting, hasNextPage, error, fetchNextPage]);

    if (error) {
        return <div>Error</div>;
    }

    return (
        <>
            {data?.map((page, index) => (
                <Fragment key={index}>
                    {page.results.map((pokemon) => (
                        <PokemonCard key={pokemon.name} pokemon={pokemon} />
                    ))}
                </Fragment>
            ))}
            {isLoading && <LoadingSkeleton />}
            <div ref={captureIntersectionElement} />
        </>
    );
};
