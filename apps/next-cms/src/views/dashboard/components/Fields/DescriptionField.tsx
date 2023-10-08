import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormControl } from './shared';

export function DescriptionField({
    className,
    name = 'component-description',
    placeholder = "Component's description",
    label = 'Description',
    message,
    status,
    wrapperProps,
    ...rest
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>) {
    return (
        <FormControl label={label} message={message} status={status} wrapperProps={wrapperProps}>
            <textarea
                name={name}
                placeholder={placeholder}
                className={twMerge(
                    clsx('w-full textarea textarea-bordered textarea-ghost transition-all', {
                        'textarea-error': status === 'error',
                        'textarea-success': status === 'success',
                        'textarea-warning': status === 'warning',
                    }),
                    className,
                )}
                {...rest}
            />
        </FormControl>
    );
}

DescriptionField.FormField = function NameFormField({
    name = 'component-description',
    ...rest
}: React.ComponentProps<typeof DescriptionField>) {
    const { register } = useFormContext();
    return <DescriptionField {...rest} {...register(name)} />;
};
