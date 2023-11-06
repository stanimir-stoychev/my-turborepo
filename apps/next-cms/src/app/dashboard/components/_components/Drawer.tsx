'use client';

import clsx from 'clsx';

export function Drawer({
    isOpen,
    onClose,
    children,
}: {
    isOpen?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}) {
    return (
        <aside
            className={clsx('fixed top-0 left-0 w-screen h-screen transition-all opacity-1 z-30', {
                'pointer-events-none -z-10 opacity-0': !isOpen,
            })}
        >
            <button
                data-tip="Close (backdrop)"
                onClick={onClose}
                className="absolute left-0 right-0 w-full h-full bg-slate-700/70"
            />
            <main className="absolute right-0 w-2/3 h-full p-4 overflow-auto rounded-l bg-base-100">{children}</main>
        </aside>
    );
}
