import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FormControl } from './shared';

type TSeoNameFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    Pick<React.ComponentProps<typeof FormControl>, 'label' | 'message' | 'status' | 'wrapperProps'>;

type TSeoNameField = React.ForwardRefExoticComponent<TSeoNameFieldProps> & {
    FormField: React.ComponentType<
        TSeoNameFieldProps & {
            registerOptions?: Parameters<ReturnType<typeof useFormContext>['register']>[1];
        }
    >;
};

export const SeoNameField = forwardRef<HTMLInputElement, TSeoNameFieldProps>(
    (
        {
            className,
            name = 'component-seo-name',
            placeholder = "Component's SEO name",
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
) as TSeoNameField;

SeoNameField.FormField = ({ name = 'component-seo-name', registerOptions, ...rest }) => {
    const { register } = useFormContext();
    return <SeoNameField {...rest} {...register(name, registerOptions)} />;
};
