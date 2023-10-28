'use client';

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useDashboardComponentsContext } from './Context';
import type { TComponentUpdate, TCreateNewComponentServerAction, TNewComponent } from '../_actions';
import type { TPrettify } from '~/types';

export namespace TCreateNewComponentForm {
    type UseFormHookData = ReturnType<typeof useForm<TNewComponent>>;
    type UseFormHookParams = NonNullable<Parameters<typeof useForm<TCreateNewComponentServerAction.Schema>>[0]>;

    export type ComponentProps = TPrettify<
        Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> & {
            onSubmit?: Parameters<UseFormHookData['handleSubmit']>[0];
            defaultValues?: UseFormHookParams['defaultValues'];
        }
    >;
}

export function CreateNewComponentForm({ onSubmit, ...rest }: TCreateNewComponentForm.ComponentProps) {
    const {
        apiData: { createNewComponent },
    } = useDashboardComponentsContext();
    const methods = useForm<TNewComponent>({ context: createNewComponent });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        createNewComponent.execute({ ...data, html: data.html ?? '' });
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

export function UpdateComponentForm({
    id,
    onSubmit,
    ...rest
}: Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> & {
    id: string;
    onSubmit?: Parameters<ReturnType<typeof useForm<TComponentUpdate>>['handleSubmit']>[0];
}) {
    const methods = useForm<TComponentUpdate>({
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
