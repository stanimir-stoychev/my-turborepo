import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormControl } from './shared';

export function NameField({
    className,
    name = 'component-name',
    placeholder = "Component's name",
    message,
    status,
    wrapperProps,
    ...rest
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    Pick<React.ComponentProps<typeof FormControl>, 'message' | 'status' | 'wrapperProps'>) {
    return (
        <FormControl label="Name" message={message} status={status} wrapperProps={wrapperProps}>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                className={twMerge(
                    clsx('w-full max-w-xs input input-bordered input-ghost transition-all', {
                        'input-error': status === 'error',
                        'input-success': status === 'success',
                        'input-warning': status === 'warning',
                    }),
                    className,
                )}
                {...rest}
            />
        </FormControl>
    );
}

NameField.FormField = function NameFormField({
    name = 'component-name',
    ...rest
}: React.ComponentProps<typeof NameField>) {
    const { register } = useFormContext();
    return <NameField {...rest} {...register(name)} />;
};