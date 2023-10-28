import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AwesomeIcon } from '~/components';

export type TStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';
export type TWithStatus = { status?: TStatus };
export type TWithMessage = { message?: string };

export function Label({
    children,
    className,
    status = 'idle',
    ...rest
}: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & TWithStatus) {
    return (
        <label className={twMerge('label', className)} {...rest}>
            <span className="label-text">{children}</span>
            {status === 'loading' && <span className="label-text-alt loading loading-dots loading-xs text-accent" />}

            {status === 'success' && (
                <span className="label-text-alt text-success">
                    <AwesomeIcon icon="check" />
                </span>
            )}

            {status === 'error' && (
                <span className="label-text-alt text-error">
                    <AwesomeIcon icon="x" />
                </span>
            )}

            {status === 'warning' && (
                <span className="label-text-alt text-warning">
                    <AwesomeIcon icon="exclamation" />
                </span>
            )}
        </label>
    );
}

export function Message({
    className,
    message,
    status = 'idle',
    ...rest
}: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, 'children'> &
    TWithMessage &
    TWithStatus) {
    if (!message) return null;

    return (
        <label className={twMerge('label', className)} {...rest}>
            <span
                className={clsx('label-text', {
                    'text-error': status === 'error',
                    'text-success': status === 'success',
                    'text-warning': status === 'warning',
                })}
            >
                {message}
            </span>
        </label>
    );
}

export function FormControl({
    children,
    label,
    message,
    status,
    wrapperProps,
}: TWithMessage &
    TWithStatus &
    React.PropsWithChildren<{
        label?: React.ReactNode;
        wrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    }>) {
    return (
        <div {...wrapperProps} className={twMerge('w-full form-control', wrapperProps?.className)}>
            <Label status={status}>{label}</Label>
            {children}
            <Message message={message} status={status} />
        </div>
    );
}
