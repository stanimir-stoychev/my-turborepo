'use client';

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

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
            defaultValues?: UseFormHookParams['defaultValues'];
        }
    >;
}

export function CreateNewComponentForm({ onSubmit, ...rest }: TCreateNewComponentForm.ComponentProps) {
    const {
        apiData: { createNewComponent },
    } = useDashboardComponentsContext();
    const methods = useForm<TCreateNewComponentServerAction.TSchema>({
        context: createNewComponent,
    });

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
