'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export function Menu({
    children,
    options,
}: React.PropsWithChildren<{ options: React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLLIElement>>[] }>) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { closeOptions, openOptions } = useMemo(
        () => ({
            closeOptions: () => setIsOpen(false),
            openOptions: () => setIsOpen(true),
        }),
        [setIsOpen],
    );

    useEffect(
        function handleClickOutside() {
            const handler = (event: MouseEvent) => {
                if (!rootRef.current?.contains(event.target as Node)) {
                    closeOptions();
                }
            };

            document.addEventListener('click', handler);
            return () => document.removeEventListener('click', handler);
        },
        [closeOptions],
    );

    return (
        <div ref={rootRef} className="relative">
            <button disabled={isOpen} onClick={openOptions}>
                {children}
            </button>
            <ul
                className={clsx('absolute right-0 rounded-sm py-1 transition-all min-w-max', {
                    'opacity-0 -z-10 pointer-events-none': !isOpen,
                    'opacity-100': isOpen,
                    'bg-white': isOpen,
                    'bg-transparent': !isOpen,
                })}
            >
                {options.map(({ children, className, onClick, ...option }, index) => (
                    <li
                        key={index}
                        tabIndex={0}
                        role="button"
                        className={clsx(
                            'px-2 py-1 transition-colors cursor-pointer hover:bg-black/5 text-black min-w-max',
                            className,
                        )}
                        onClick={(event) => {
                            closeOptions();
                            onClick?.(event);
                        }}
                        {...option}
                    >
                        {children}
                    </li>
                ))}
            </ul>
        </div>
    );
}
