import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import type { TComponentUpdate, TNewComponent } from '~/server/repositories';

export function CreateNewComponentForm({
    onSubmit,
    ...rest
}: Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> & {
    onSubmit?: Parameters<ReturnType<typeof useForm<TNewComponent>>['handleSubmit']>[0];
}) {
    const methods = useForm<TNewComponent>();

    const handleSubmit = methods.handleSubmit((data, event) => {
        onSubmit?.(data, event);
        console.log('Submitting "Create new Component" form ...', data);
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
