import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormControl } from './shared';
import { forwardRef } from 'react';

type TSeoDescriptionFieldProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>;

export const SeoDescriptionField = forwardRef<HTMLTextAreaElement, TSeoDescriptionFieldProps>(
    (
        {
            className,
            name = 'component-seo-description',
            placeholder = "Component's SEO description",
            label = 'Description',
            message,
            status,
            wrapperProps,
            ...rest
        },
        ref,
    ) => (
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
    ),
) as React.ForwardRefExoticComponent<TSeoDescriptionFieldProps> & {
    FormField: React.ComponentType<TSeoDescriptionFieldProps>;
};

SeoDescriptionField.FormField = function NameFormField({
    name = 'component-seo-description',
    ...rest
}: React.ComponentProps<typeof SeoDescriptionField>) {
    const { register } = useFormContext();
    return <SeoDescriptionField {...rest} {...register(name)} />;
};
