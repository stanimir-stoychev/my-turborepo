import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormControl } from './shared';

export function SeoDescriptionField({
    className,
    name = 'component-seo-description',
    placeholder = "Component's SEO description",
    message,
    status,
    wrapperProps,
    ...rest
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> &
    Pick<React.ComponentProps<typeof FormControl>, 'message' | 'status' | 'wrapperProps'>) {
    return (
        <FormControl label="Description" message={message} status={status} wrapperProps={wrapperProps}>
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

SeoDescriptionField.FormField = function NameFormField({
    name = 'component-seo-description',
    ...rest
}: React.ComponentProps<typeof SeoDescriptionField>) {
    const { register } = useFormContext();
    return <SeoDescriptionField {...rest} {...register(name)} />;
};
