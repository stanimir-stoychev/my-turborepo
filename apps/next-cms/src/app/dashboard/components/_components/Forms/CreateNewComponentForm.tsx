'use client';

import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { useDashboardComponentsContext } from '../Context';

import type { TPrettify } from '~/types';
import type { TCreateNewComponentServerAction } from '../../_actions';
import { TDashboardComponentsPage } from '../types';

type UseFromHook = typeof useForm<
    TCreateNewComponentServerAction.TSchema,
    TDashboardComponentsPage['apiData']['createNewComponent']
>;

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
    const {
        apiData: { createNewComponent },
    } = useDashboardComponentsContext();
    const methods: UseFormHookData = useForm({
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
                message: 'Created successfully',
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
