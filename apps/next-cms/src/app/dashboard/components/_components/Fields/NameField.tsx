import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FormControl } from './shared';

type TNameFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>;

type TNameField = React.ForwardRefExoticComponent<TNameFieldProps> & {
    FormField: React.ComponentType<
        TNameFieldProps & {
            registerOptions?: Parameters<ReturnType<typeof useFormContext>['register']>[1];
        }
    >;
};

export const NameField = forwardRef<HTMLInputElement, TNameFieldProps>(
    (
        {
            className,
            name = 'component-name',
            placeholder = "Component's name",
            label = 'Name',
            message,
            status,
            wrapperProps,
            ...rest
        },
        ref,
    ) => (
        <FormControl label={label} message={message} status={status} wrapperProps={wrapperProps}>
            <input
                ref={ref}
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
    ),
) as TNameField;

NameField.FormField = ({ name = 'component-name', registerOptions, ...rest }) => {
    const { register } = useFormContext();
    return <NameField {...rest} {...register(name, registerOptions)} />;
};
