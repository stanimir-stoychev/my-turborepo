'use client';

import NextLink from 'next/link';

import { signOut, useSession } from 'next-auth/react';

import { AwesomeIcon } from './AwesomeIcon';
import { Menu } from './Menu';

const userOptions: React.ComponentProps<typeof Menu>['options'] = [
    {
        children: (
            <NextLink className="block" href="/dashboard">
                Dashboard
            </NextLink>
        ),
    },
    {
        onClick: () => signOut(),
        children: 'Sign out',
    },
];

export function AuthenticatedUserActionsToolbar() {
    const { data, status } = useSession();

    if (status === 'loading' || status === 'unauthenticated' || !data?.user) {
        return null;
    }

    const url = window.location.pathname;

    if (!url || url.includes('/dashboard')) {
        return null;
    }

    return (
        <aside
            className="flex items-center gap-2 px-2 py-0.5 bg-secondary"
            data-testid="authenticated-user-actions-toolbar"
        >
            Hello {data.user.name ?? data.user.email ?? 'unknown user'}!
            <div className="flex-1" />
            <Menu options={userOptions}>
                <AwesomeIcon icon="user" />
            </Menu>
        </aside>
    );
}
