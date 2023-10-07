import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { AwesomeIcon } from '~/components';

type TDashboardToast = {
    message: React.ReactNode;
    type?: 'info' | 'warning' | 'success' | 'error';
    divProps?: Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'children'>;
    timeToLive?: number;
};

export type TDashboardToaster = {
    pushToast: (toast: TDashboardToast) => () => void;
    removeToast: (toast: TDashboardToast) => void;
    toasts: TDashboardToast[];
    hiddenToasts?: TDashboardToast[];
    visibleToasts: TDashboardToast[];
};

const defaultContext: TDashboardToaster = {
    pushToast: () => () => undefined,
    removeToast: () => undefined,
    toasts: [],
    visibleToasts: [],
};

const DashboardToasterContext = createContext(defaultContext);
DashboardToasterContext.displayName = '"Dashboard" Toaster Context';

const useBuildDashboardToaster = (maxOnDisplay: number): TDashboardToaster => {
    const [toasts, setToasts] = useState(defaultContext.toasts);

    const removeToast = useCallback((toast: TDashboardToast) => {
        setToasts((currentToasts) => currentToasts.filter((queuedToast) => queuedToast !== toast));
    }, []);

    const pushToast: TDashboardToaster['pushToast'] = useCallback((toast) => {
        setToasts((currentToasts) => [...currentToasts, toast]);

        if (toast.timeToLive !== Infinity) {
            setTimeout(() => removeToast(toast), toast.timeToLive ?? 5000);
        }

        return () => setToasts((currentToasts) => currentToasts.filter((queuedToast) => queuedToast !== toast));
    }, []);

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
    };
};

export const useDashboardToaster = () => useContext(DashboardToasterContext);

function VisibleToast({ toast }: { toast: TDashboardToast }) {
    const { removeToast } = useDashboardToaster();
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
    const { hiddenToasts } = useDashboardToaster();

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

export function DashboardToasterProvider({
    children,
    className,
    maxOnDisplay = 5,
    ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & { maxOnDisplay?: number }) {
    const context = useBuildDashboardToaster(maxOnDisplay);
    return (
        <DashboardToasterContext.Provider value={context}>
            {children}
            <aside className={twMerge('toast', className)} {...rest}>
                <HiddenToasts />
                {context.visibleToasts.map((toast, index) => (
                    <VisibleToast key={index} toast={toast} />
                ))}
            </aside>
        </DashboardToasterContext.Provider>
    );
}

DashboardToasterProvider.Toast = VisibleToast;
