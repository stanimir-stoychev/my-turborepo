'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import { useClickAway, useKey, useToggle } from 'react-use';

export function Menu({
    children,
    className,
    btnProps,
    ulProps,
    options,
    position = 'bottom-right',
    ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
    btnProps?: Omit<React.HtmlHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'onClick'>;
    ulProps?: Omit<React.HtmlHTMLAttributes<HTMLUListElement>, 'children'>;
    options: React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLLIElement>>[];
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, toggleIsOpen] = useToggle(false);

    useClickAway(rootRef, () => toggleIsOpen(false));
    useKey('Escape', () => toggleIsOpen(false));

    return (
        <div ref={rootRef} className={clsx('relative', className)} {...rest}>
            <button disabled={isOpen} onClick={toggleIsOpen} {...btnProps}>
                {children}
            </button>
            <ul
                {...ulProps}
                role="list"
                className={clsx('absolute rounded-sm py-1 transition-all min-w-max', ulProps?.className, {
                    'opacity-0 -z-10 pointer-events-none': !isOpen,
                    'opacity-100': isOpen,
                    'bg-white': isOpen,
                    'bg-transparent': !isOpen,
                    'left-0 top-0': position === 'bottom-right',
                    'right-0 top-0': position === 'bottom-left',
                    'left-0 bottom-0': position === 'top-right',
                    'right-0 bottom-0': position === 'top-left',
                })}
            >
                {options.map(({ children, className, onClick, ...option }, index) => (
                    <li
                        key={index}
                        tabIndex={0}
                        role="button"
                        className={clsx(
                            'px-2 py-1 cursor-pointer focus:bg-black/5 hover:bg-black/5 text-black min-w-max transition-colors',
                            className,
                        )}
                        onClick={(event) => {
                            toggleIsOpen();
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
