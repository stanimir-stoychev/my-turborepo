import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FormControl } from './shared';

type TDescriptionFieldProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>;

type TDescriptionField = React.ForwardRefExoticComponent<TDescriptionFieldProps> & {
    FormField: React.ComponentType<
        TDescriptionFieldProps & {
            registerOptions?: Parameters<ReturnType<typeof useFormContext>['register']>[1];
        }
    >;
};

export const DescriptionField = forwardRef<HTMLTextAreaElement, TDescriptionFieldProps>(
    (
        {
            className,
            name = 'component-description',
            placeholder = "Component's description",
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
) as TDescriptionField;

DescriptionField.FormField = ({ name = 'component-description', registerOptions, ...rest }) => {
    const { register } = useFormContext();
    return <DescriptionField {...rest} {...register(name, registerOptions)} />;
};
