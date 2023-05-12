'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useZact } from 'zact/client';

import { useIntersection } from '@/hooks';

import { pokemonSearchAction } from '../actions';
import { PokemonCard } from './PokemonCard';

type PokemonCardsListProps = {
    cursor?: string;
    limit?: number;
};

const useInfinitePokemon = (searchQuery: PokemonCardsListProps) => {
    const { data: zactData, isLoading: zactIsLoading, mutate } = useZact(pokemonSearchAction);
    const [data, setData] = useState([] as NonNullable<typeof zactData>[]);
    const [nextPageParams, setNextPageParams] = useState(searchQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const fetchNextPage = useCallback(() => {
        if (isLoading || zactIsLoading) return;

        setHasFetchedOnce(true);
        setIsLoading(true);
        mutate(nextPageParams);
    }, [nextPageParams, zactIsLoading, mutate]);

    useEffect(() => {
        if (!zactData) return;

        setIsLoading(false);
        setData((prevData) => [...prevData, zactData]);
        setNextPageParams((prevParams) => ({
            ...prevParams,
            cursor: zactData?.nextCursor,
        }));
    }, [zactData]);

    return {
        data,
        fetchNextPage,
        hasNextPage: !hasFetchedOnce ? true : !!zactData?.nextCursor,
        isLoading: zactIsLoading || isLoading,
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
    const loadMoreInterceptor = useIntersection(useMemo(() => ({ threshold: 1 }), []));
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfinitePokemon(props);

    useEffect(() => {
        if (!loadMoreInterceptor.intersection?.isIntersecting || !hasNextPage || isLoading) return;
        fetchNextPage();
    }, [loadMoreInterceptor.intersection?.isIntersecting, isLoading, fetchNextPage]);

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
            <div ref={loadMoreInterceptor.captureIntersectionElement} />
        </>
    );
};
