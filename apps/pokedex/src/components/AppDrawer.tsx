'use client';

import { forwardRef, useCallback } from 'react';
import { useKey } from 'react-use';

import { APP_DRAWER_TOGGLE_ID } from '@/src/constants';
import { TBaseElement } from '@/src/types';

export const AppDrawerToggle = forwardRef(function AppDrawerToggle(
    { onKeyDown, ...props }: TBaseElement<HTMLLabelElement>,
    ref: React.Ref<HTMLLabelElement>,
) {
    return (
        <label
            ref={ref}
            tabIndex={0}
            {...props}
            htmlFor={APP_DRAWER_TOGGLE_ID}
            onKeyDown={useCallback(
                (event: React.KeyboardEvent<HTMLLabelElement>) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onKeyDown?.(event);

                        const toggle = document.getElementById(APP_DRAWER_TOGGLE_ID) as HTMLInputElement;
                        if (toggle && !toggle?.checked) {
                            toggle.checked = true;
                        }
                    }
                },
                [onKeyDown],
            )}
        />
    );
});

const closeAppDrawer = () => {
    const toggle = document.getElementById(APP_DRAWER_TOGGLE_ID) as HTMLInputElement;
    if (toggle?.checked) {
        toggle.checked = false;
    }
};

export const AppDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    useKey('Escape', closeAppDrawer, { event: 'keydown' });

    return (
        <>
            Coming soon...
            {children}
        </>
    );
};
