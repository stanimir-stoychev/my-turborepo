'use client';

import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { usePageContext } from '../../_context';

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
    const { dispatch, state } = usePageContext();
    const methods: UseFormHookData = useForm({
        defaultValues: state.createNewComponent.defaultValues,
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        dispatch({
            type: 'create-new-component',
            payload: data,
        });
    });

    const dataSource = state.createNewComponent.api;
    const { pushToast } = useToaster();
    const prevStatus = usePrevious(dataSource.status);
    useEffect(() => {
        if (dataSource.status === prevStatus) return;
        if (dataSource.status === 'success' && dataSource.data) {
            onSuccessfulSubmit?.({
                payload: methods.getValues(),
                response: dataSource.data,
            });
            pushToast({
                type: 'success',
                message: 'Created successfully',
            });
            methods.reset();
            dispatch({ type: 'reset-create-new-component-api-data' });
            dispatch({ type: 'retry-last-search-components-api-call' });
        }
    }, [dataSource.data, dataSource.status, prevStatus]);

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
