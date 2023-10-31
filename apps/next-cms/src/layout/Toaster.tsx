'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { AwesomeIcon } from '~/components';

type TToast = {
    message: React.ReactNode;
    type?: 'info' | 'warning' | 'success' | 'error';
    divProps?: Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'children'>;
    timeToLive?: number;
};

export type TToaster = {
    pushToast: (toast: TToast) => () => void;
    removeToast: (toast: TToast) => void;
    toasts: TToast[];
    hiddenToasts?: TToast[];
    visibleToasts: TToast[];
    toastHelloWorld: () => void;
};

const defaultContext: TToaster = {
    pushToast: () => () => undefined,
    removeToast: () => undefined,
    toasts: [],
    visibleToasts: [],
    toastHelloWorld: () => undefined,
};

const ToasterContext = createContext(defaultContext);
ToasterContext.displayName = 'Toaster Context (root)';

const useBuildToaster = (maxOnDisplay: number): TToaster => {
    const [toasts, setToasts] = useState(defaultContext.toasts);

    const removeToast = useCallback((toast: TToast) => {
        setToasts((currentToasts) => currentToasts.filter((queuedToast) => queuedToast !== toast));
    }, []);

    const pushToast: TToaster['pushToast'] = useCallback((toast) => {
        setToasts((currentToasts) => [...currentToasts, toast]);

        if (toast.timeToLive !== Infinity) {
            setTimeout(() => removeToast(toast), toast.timeToLive ?? 5000);
        }

        return () => setToasts((currentToasts) => currentToasts.filter((queuedToast) => queuedToast !== toast));
    }, []);

    const toastHelloWorld = useCallback(() => {
        pushToast({
            message: 'Hello world!',
            type: 'info',
            timeToLive: Infinity,
        });
    }, [pushToast]);

    const { hiddenToasts, visibleToasts } = useMemo(
        () => ({
            visibleToasts: toasts.slice(-maxOnDisplay),
            ...(toasts.length > maxOnDisplay && {
                hiddenToasts: toasts.slice(0, -maxOnDisplay),
            }),
        }),
        [toasts, maxOnDisplay],
    );

    return {
        pushToast,
        removeToast,
        toasts,
        hiddenToasts,
        visibleToasts,
        toastHelloWorld,
    };
};

export const useToaster = () => useContext(ToasterContext);

function VisibleToast({ toast }: { toast: TToast }) {
    const { removeToast } = useToaster();
    const { divProps, message, type = 'info' } = toast;

    const icon = useMemo((): React.ComponentProps<typeof AwesomeIcon>['icon'] => {
        if (type === 'warning') return 'exclamation-triangle';
        if (type === 'success') return 'check-circle';
        if (type === 'error') return 'times-circle';
        return 'info-circle';
    }, [type]);

    return (
        <div
            {...divProps}
            className={twMerge(
                clsx('alert flex gap-2', {
                    'alert-info': type === 'info',
                    'alert-warning': type === 'warning',
                    'alert-success': type === 'success',
                    'alert-error': type === 'error',
                }),
                divProps?.className,
            )}
        >
            <AwesomeIcon icon={icon} />
            {message}
            <div className="flex-1" />
            <button
                type="button"
                aria-label="Dismiss message"
                className={clsx('btn btn-ghost btn-xs btn-neutral')}
                onClick={() => removeToast(toast)}
            >
                <AwesomeIcon icon="times" />
            </button>
        </div>
    );
}

function HiddenToasts() {
    const { hiddenToasts } = useToaster();

    if (!hiddenToasts?.length) return null;

    return (
        <div className="dropdown dropdown-top dropdown-end">
            <label tabIndex={0} className="w-full m-1 btn bg-info/70 btn-info">
                {hiddenToasts.length} more...
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box w-52 gap-2">
                {hiddenToasts.map((toast, index) => (
                    <li key={index}>
                        <VisibleToast toast={toast} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ToasterProvider({
    children,
    className,
    maxOnDisplay = 5,
    ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & { maxOnDisplay?: number }) {
    const context = useBuildToaster(maxOnDisplay);
    return (
        <ToasterContext.Provider value={context}>
            {children}
            {!!context.visibleToasts.length && (
                <aside className={twMerge('toast z-50', className)} {...rest}>
                    <HiddenToasts />
                    {context.visibleToasts.map((toast, index) => (
                        <VisibleToast key={index} toast={toast} />
                    ))}
                </aside>
            )}
        </ToasterContext.Provider>
    );
}

ToasterProvider.Toast = VisibleToast;
