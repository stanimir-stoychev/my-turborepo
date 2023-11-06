'use client';

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';

import { CreateComponentQuery, queryKeys } from '../../_queries';
import { usePageView } from '../PageView';

import type { TPrettify } from '~/types';
import type { TCreateNewComponentServerAction } from '../../_actions';

type UseFromHook = typeof useForm<TCreateNewComponentServerAction.TSchema>;
type UseFormHookData = ReturnType<UseFromHook>;

type BaseHtmlFormProps = Omit<
    React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'onSubmit'
>;

type ComponentProps = TPrettify<
    BaseHtmlFormProps & {
        onSubmit?: Parameters<UseFormHookData['handleSubmit']>[0];
        onSuccessfulSubmit?: (args: {
            payload: TCreateNewComponentServerAction.TSchema;
            response: TCreateNewComponentServerAction.Data;
        }) => void;
        defaultValues?: TCreateNewComponentServerAction.TSchema;
    }
>;

export function CreateNewComponentForm({ onSubmit, onSuccessfulSubmit, ...rest }: ComponentProps) {
    const { viewActions } = usePageView();
    const methods: UseFormHookData = useForm();

    const { pushToast } = useToaster();
    const queryClient = useQueryClient();
    const { mutate } = CreateComponentQuery.useMutation({
        onSuccess: () => {
            pushToast({
                type: 'success',
                message: 'Created successfully',
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.root,
            });

            viewActions.setCreateNewComponent(false);
        },
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        mutate(data);
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} {...rest} />
        </FormProvider>
    );
}

CreateNewComponentForm.SubmitButton = function SubmitButton({
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
