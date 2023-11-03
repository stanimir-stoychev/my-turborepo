import { UseMutationOptions, useMutation as useReactMutation } from '@tanstack/react-query';
import { deleteComponentGateway } from '../_actions';
import { queryKeys } from './keys';

export module DeleteComponentQuery {
    export type TApiResponse = Awaited<ReturnType<typeof deleteComponentGateway>>;

    export const useMutation = (
        options: UseMutationOptions<TApiResponse, unknown, Parameters<typeof queryKeys.delete>[0]>,
    ) =>
        useReactMutation({
            mutationFn: deleteComponentGateway,
            ...options,
        });
}
