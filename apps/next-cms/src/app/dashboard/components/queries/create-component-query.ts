import {
    UseQueryOptions,
    useQuery as useReactQuery,
    UseMutationOptions,
    useMutation as useReactMutation,
} from '@tanstack/react-query';
import { createComponentGateway } from '../_actions';
import { queryKeys } from './keys';

export module CreateComponentQuery {
    export type TApiResponse = Awaited<ReturnType<typeof createComponentGateway>>;

    export const useQuery = <T = TApiResponse>(
        data: Parameters<typeof queryKeys.create>[0],
        options?: UseQueryOptions<TApiResponse, unknown, T, ReturnType<typeof queryKeys.create>>,
    ) =>
        useReactQuery({
            queryKey: queryKeys.create(data),
            queryFn: () => createComponentGateway(data),
            ...options,
        });

    export const useMutation = (
        options: UseMutationOptions<TApiResponse, unknown, Parameters<typeof queryKeys.create>[0]>,
    ) =>
        useReactMutation({
            mutationFn: createComponentGateway,
            ...options,
        });
}
