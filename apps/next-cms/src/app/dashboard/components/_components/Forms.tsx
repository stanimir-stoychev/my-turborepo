'use client';

import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { useDashboardComponentsContext } from './Context';

import type { TPrettify } from '~/types';
import type { TComponentEntity } from '~/server/domains/components';
import type { TzUpdateComponentEntity, TCreateNewComponentServerAction } from '../_actions';

export namespace TCreateNewComponentForm {
    type UseFromHook = typeof useForm<TCreateNewComponentServerAction.TSchema>;
    type UseFormHookData = ReturnType<UseFromHook>;
    type UseFormHookParams = NonNullable<Parameters<UseFromHook>[0]>;
    type BaseHtmlFormProps = Omit<
        React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
        'onSubmit'
    >;

    export type ComponentProps = TPrettify<
        BaseHtmlFormProps & {
            onSubmit?: Parameters<UseFormHookData['handleSubmit']>[0];
            onSuccessfulSubmit?: (args: {
                payload: TCreateNewComponentServerAction.TSchema;
                response: TCreateNewComponentServerAction.Data;
            }) => void;
            defaultValues?: UseFormHookParams['defaultValues'];
        }
    >;
}

export function CreateNewComponentForm({
    onSubmit,
    onSuccessfulSubmit,
    ...rest
}: TCreateNewComponentForm.ComponentProps) {
    const {
        apiData: { createNewComponent },
    } = useDashboardComponentsContext();
    const methods = useForm<TCreateNewComponentServerAction.TSchema>({
        context: createNewComponent,
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        createNewComponent.execute(data);
    });

    const { pushToast } = useToaster();
    const prevStatus = usePrevious(createNewComponent.status);
    useEffect(() => {
        if (createNewComponent.status === prevStatus) return;
        if (createNewComponent.status === 'hasSucceeded' && createNewComponent.result.data) {
            onSuccessfulSubmit?.({
                payload: methods.getValues(),
                response: createNewComponent.result.data,
            });
            pushToast({
                type: 'success',
                message: 'Component created successfully',
            });
            methods.reset();
            createNewComponent.reset();
        }
    }, [createNewComponent.result, createNewComponent.status, prevStatus]);

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

export function UpdateComponentForm({
    id,
    onSubmit,
    ...rest
}: Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> & {
    id: TComponentEntity['id'];
    onSubmit?: Parameters<ReturnType<typeof useForm<TzUpdateComponentEntity>>['handleSubmit']>[0];
}) {
    const methods = useForm<TzUpdateComponentEntity>({
        defaultValues: { id },
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        console.log('Submitting "Update Component" form ...', data);
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} {...rest} />
        </FormProvider>
    );
}
