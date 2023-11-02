'use client';

import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { usePageContext } from '../../_context';

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
    const { dispatch, state } = usePageContext();
    const methods: UseFormHookData = useForm({
        defaultValues: { ...state.editComponent.selected, id: entityId },
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        dispatch({
            type: 'update-component',
            payload: data,
        });
    });

    const updateComponent = state.editComponent.api;
    const { pushToast } = useToaster();
    const prevStatus = usePrevious(updateComponent.status);
    useEffect(() => {
        if (updateComponent.status === prevStatus) return;
        if (updateComponent.status === 'success' && updateComponent.data) {
            onSuccessfulSubmit?.({
                payload: methods.getValues(),
                response: updateComponent.data,
            });
            pushToast({
                type: 'success',
                message: 'Updated successfully',
            });
            methods.reset();
            dispatch({ type: 'reset-updated-component-api-data' });
        }
    }, [updateComponent.data, updateComponent.status, prevStatus]);

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
