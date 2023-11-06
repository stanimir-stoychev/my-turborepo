'use client';

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { UpdateComponentQuery, queryKeys } from '../../_queries';
import { usePageView } from '../PageView';

import type { TPrettify } from '~/types';
import type { TComponentEntity } from '~/server/domains/components';
import type { TUpdateComponentServerAction } from '../../_actions';

type UseFromHook = typeof useForm<TUpdateComponentServerAction.TSchema>;
type UseFormHookData = ReturnType<UseFromHook>;

type BaseHtmlFormProps = Omit<
    React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'onSubmit'
>;

type ComponentProps = TPrettify<
    BaseHtmlFormProps & {
        entityId: TComponentEntity['id'];
        onSubmit?: Parameters<UseFormHookData['handleSubmit']>[0];
        onSuccessfulSubmit?: (args: {
            payload: TUpdateComponentServerAction.TSchema;
            response: TUpdateComponentServerAction.Data;
        }) => void;
        defaultValues?: TUpdateComponentServerAction.TSchema;
    }
>;

export function UpdateComponentForm({
    children,
    defaultValues,
    entityId,
    onSubmit,
    onSuccessfulSubmit,
    ...rest
}: ComponentProps) {
    const { editComponent, viewActions } = usePageView();

    const { pushToast } = useToaster();
    const queryClient = useQueryClient();
    const { mutate } = UpdateComponentQuery.useMutation({
        onSuccess: () => {
            viewActions.setEditComponent(undefined);
            queryClient.invalidateQueries({ queryKey: queryKeys.root });
            pushToast({
                type: 'success',
                message: 'Updated successfully',
            });
        },
    });

    const methods: UseFormHookData = useForm({
        defaultValues: { ...editComponent, id: entityId },
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        mutate(data);
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} {...rest}>
                <input type="hidden" name="id" value={entityId} />
                {children}
            </form>
        </FormProvider>
    );
}

UpdateComponentForm.SubmitButton = function SubmitButton({
    children,
    className,
    ...rest
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    const { formState } = useFormContext();
    return (
        <button type="submit" disabled={!formState.isValid} className={twMerge('btn', className)} {...rest}>
            {children}
        </button>
    );
};
