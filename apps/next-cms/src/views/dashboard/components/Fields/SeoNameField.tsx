import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormControl } from './shared';

export function SeoNameField({
    className,
    name = 'component--seo-name',
    placeholder = "Component's SEO name",
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
                    clsx('w-full input input-bordered input-ghost transition-all', {
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

SeoNameField.FormField = function NameFormField({
    name = 'component-seo-name',
    ...rest
}: React.ComponentProps<typeof SeoNameField>) {
    const { register } = useFormContext();
    return <SeoNameField {...rest} {...register(name)} />;
};
