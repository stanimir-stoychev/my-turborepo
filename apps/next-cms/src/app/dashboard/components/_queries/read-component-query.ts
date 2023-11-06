import { UseQueryOptions, useQuery as useReactQuery } from '@tanstack/react-query';
import { readComponentGateway } from '../_actions';
import { queryKeys } from './keys';

export module ReadComponentQuery {
    export type TApiResponse = Awaited<ReturnType<typeof readComponentGateway>>;

    export const useQuery = <T = TApiResponse>(
        data: Parameters<typeof queryKeys.read>[0],
        options?: UseQueryOptions<TApiResponse, unknown, T, ReturnType<typeof queryKeys.read>>,
    ) =>
        useReactQuery({
            queryKey: queryKeys.read(data),
            queryFn: () => readComponentGateway(data),
            ...options,
        });
}
