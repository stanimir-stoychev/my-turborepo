'use client';

import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToaster } from '~/layout/Toaster';
import { useDashboardComponentsContext } from '../Context';

import type { TPrettify } from '~/types';
import type { TComponentEntity } from '~/server/domains/components';
import type { TUpdateComponentServerAction } from '../../_actions';
import type { TDashboardComponentsPage } from '../types';

type UseFromHook = typeof useForm<
    TUpdateComponentServerAction.TSchema,
    TDashboardComponentsPage['apiData']['updateComponent']
>;

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
    const {
        apiData: { updateComponent },
    } = useDashboardComponentsContext();

    const methods: UseFormHookData = useForm({
        defaultValues: { ...defaultValues, id: entityId },
        context: updateComponent,
    });

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        updateComponent.execute(data);
    });

    const { pushToast } = useToaster();
    const prevStatus = usePrevious(updateComponent.status);
    useEffect(() => {
        if (updateComponent.status === prevStatus) return;
        if (updateComponent.status === 'hasSucceeded' && updateComponent.result.data) {
            onSuccessfulSubmit?.({
                payload: methods.getValues(),
                response: updateComponent.result.data,
            });
            pushToast({
                type: 'success',
                message: 'Updated successfully',
            });
            methods.reset();
            updateComponent.reset();
        }
    }, [updateComponent.result, updateComponent.status, prevStatus]);

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
