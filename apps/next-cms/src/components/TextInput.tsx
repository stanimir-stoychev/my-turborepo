import { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type TCommonTextInputProps = {
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    inputSize?: 'xs' | 'sm' | 'md' | 'lg';
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
    variant?: 'bordered' | 'ghost';

    label?: string;
    message?: string;

    rootProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
};

type TTextInputProps = Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type'
> &
    TCommonTextInputProps;

type TTextAreaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> &
    TCommonTextInputProps;

export const TextInput = forwardRef<HTMLInputElement, TTextInputProps>((props, ref) => {
    const {
        className,

        color,
        inputSize: size,
        variant,

        label,
        message,

        rootProps,

        ...rest
    } = props;

    const inputClassName = twMerge(
        clsx('input w-full', {
            'input-bordered': variant === 'bordered',
            'input-ghost': variant === 'ghost',
            'input-primary': color === 'primary',
            'input-secondary': color === 'secondary',
            'input-accent': color === 'accent',
            'input-info': color === 'info',
            'input-success': color === 'success',
            'input-warning': color === 'warning',
            'input-error': color === 'error',
            'input-xs': size === 'xs',
            'input-sm': size === 'sm',
            'input-md': size === 'md',
            'input-lg': size === 'lg',
        }),
        className,
    );

    const textClassName = clsx('label-text', {
        'text-primary': color === 'primary',
        'text-secondary': color === 'secondary',
        'text-accent': color === 'accent',
        'text-info': color === 'info',
        'text-success': color === 'success',
        'text-warning': color === 'warning',
        'text-error': color === 'error',
    });

    return (
        <div {...rootProps} className={clsx('form-control', rootProps?.className)}>
            {label && (
                <label className="label">
                    <span className={textClassName}>{label}</span>
                </label>
            )}

            <input {...rest} className={inputClassName} />

            {message && (
                <label className="label">
                    <span className={textClassName}>{message}</span>
                </label>
            )}
        </div>
    );
}) as React.ComponentType<TTextInputProps>;

export const TextArea = forwardRef<HTMLTextAreaElement, TTextAreaProps>((props, ref) => {
    const {
        className,

        color,
        inputSize: size,
        variant,

        label,
        message,

        rootProps,

        ...rest
    } = props;

    const inputClassName = twMerge(
        clsx('textarea w-full', {
            'textarea-bordered': variant === 'bordered',
            'textarea-ghost': variant === 'ghost',
            'textarea-primary': color === 'primary',
            'textarea-secondary': color === 'secondary',
            'textarea-accent': color === 'accent',
            'textarea-info': color === 'info',
            'textarea-success': color === 'success',
            'textarea-warning': color === 'warning',
            'textarea-error': color === 'error',
            'textarea-xs': size === 'xs',
            'textarea-sm': size === 'sm',
            'textarea-md': size === 'md',
            'textarea-lg': size === 'lg',
        }),
        className,
    );

    const textClassName = clsx('label-text', {
        'text-primary': color === 'primary',
        'text-secondary': color === 'secondary',
        'text-accent': color === 'accent',
        'text-info': color === 'info',
        'text-success': color === 'success',
        'text-warning': color === 'warning',
        'text-error': color === 'error',
    });

    return (
        <div {...rootProps} className={clsx('form-control', rootProps?.className)}>
            {label && (
                <label className="label">
                    <span className={textClassName}>{label}</span>
                </label>
            )}

            <textarea {...rest} className={inputClassName} />

            {message && (
                <label className="label">
                    <span className={textClassName}>{message}</span>
                </label>
            )}
        </div>
    );
}) as React.ComponentType<TTextAreaProps>;
