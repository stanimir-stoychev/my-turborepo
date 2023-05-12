'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useZact } from 'zact/client';

import { useIntersection } from '@/hooks';

import { pokemonSearchAction } from '../actions';
import { PokemonCard, PokemonCardSkeletons } from './PokemonCard';

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
    }, [nextPageParams, isLoading, zactIsLoading, mutate]);

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

export const PokemonCardsList: React.FC<PokemonCardsListProps> = (props) => {
    const loadMoreInterceptor = useIntersection(useMemo(() => ({ threshold: 1 }), []));
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfinitePokemon(props);

    useEffect(() => {
        if (!loadMoreInterceptor.intersection?.isIntersecting || !hasNextPage || isLoading) return;

        fetchNextPage();
    }, [loadMoreInterceptor.intersection?.isIntersecting, hasNextPage, isLoading, fetchNextPage]);

    return (
        <>
            {data?.map((page, index) => (
                <Fragment key={index}>
                    {page.results.map((pokemon) => (
                        <PokemonCard key={pokemon.name} pokemon={pokemon} />
                    ))}
                </Fragment>
            ))}
            {isLoading && <PokemonCardSkeletons length={props.limit} />}
            <div ref={loadMoreInterceptor.captureIntersectionElement} />
        </>
    );
};
