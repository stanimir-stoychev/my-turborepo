import {
    UseQueryOptions,
    useQuery as useReactQuery,
    UseMutationOptions,
    useMutation as useReactMutation,
} from '@tanstack/react-query';
import { updateComponentGateway } from '../_actions';
import { queryKeys } from './keys';

export module UpdateComponentQuery {
    export type TApiResponse = Awaited<ReturnType<typeof updateComponentGateway>>;

    export const useQuery = <T = TApiResponse>(
        data: Parameters<typeof queryKeys.update>[0],
        options?: UseQueryOptions<TApiResponse, unknown, T, ReturnType<typeof queryKeys.update>>,
    ) =>
        useReactQuery({
            queryKey: queryKeys.update(data),
            queryFn: () => updateComponentGateway(data),
            ...options,
        });

    export const useMutation = (
        options: UseMutationOptions<TApiResponse, unknown, Parameters<typeof queryKeys.update>[0]>,
    ) =>
        useReactMutation({
            mutationFn: updateComponentGateway,
            ...options,
        });
}
