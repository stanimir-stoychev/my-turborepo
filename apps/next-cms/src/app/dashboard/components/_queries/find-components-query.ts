import {
    InfiniteData,
    UseInfiniteQueryOptions,
    useInfiniteQuery as useInfiniteReactQuery,
    UseQueryOptions,
    useQuery as useReactQuery,
} from '@tanstack/react-query';
import { findComponentsGateway, isGatewayError } from '../_actions';
import { queryKeys } from './keys';

export module FindComponentsQuery {
    export type TApiResponse = Awaited<ReturnType<typeof findComponentsGateway>>;

    export const useQuery = <T = TApiResponse>(
        data: Parameters<typeof queryKeys.find>[0],
        options?: UseQueryOptions<TApiResponse, unknown, T, ReturnType<typeof queryKeys.find>>,
    ) =>
        useReactQuery({
            queryKey: queryKeys.find(data),
            queryFn: () => findComponentsGateway(data),
            ...options,
        });

    export const useInfiniteQuery = <T = TApiResponse>(
        query: Parameters<typeof queryKeys.infiniteSearch>[0],
        options?: Omit<
            UseInfiniteQueryOptions<
                TApiResponse,
                unknown,
                InfiniteData<T>,
                TApiResponse,
                ReturnType<typeof queryKeys.infiniteSearch>,
                number | undefined
            >,
            'queryFn' | 'queryKey' | 'getNextPageParam' | 'getPreviousPageParam' | 'initialPageParam'
        >,
    ) =>
        useInfiniteReactQuery({
            queryKey: queryKeys.infiniteSearch(query),
            queryFn: ({ pageParam: cursor }) => findComponentsGateway({ ...query, cursor }),
            getNextPageParam: (lastPage) => (isGatewayError(lastPage) ? undefined : lastPage.nextCursor),
            initialPageParam: query.cursor,
            ...options,
        });
}
