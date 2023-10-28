import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FormControl } from './shared';

type TSeoDescriptionFieldProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>;

type TSeoDescriptionField = React.ForwardRefExoticComponent<TSeoDescriptionFieldProps> & {
    FormField: React.ComponentType<
        TSeoDescriptionFieldProps & {
            registerOptions?: Parameters<ReturnType<typeof useFormContext>['register']>[1];
        }
    >;
};

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
                ref={ref}
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
) as TSeoDescriptionField;

SeoDescriptionField.FormField = ({ name = 'component-seo-description', registerOptions, ...rest }) => {
    const { register } = useFormContext();
    return <SeoDescriptionField {...rest} {...register(name, registerOptions)} />;
};
