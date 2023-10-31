'use client';

import NextLink from 'next/link';
import { signOut } from 'next-auth/react';
import { AwesomeIcon, Menu } from '@/app/_components';

const userOptions: React.ComponentProps<typeof Menu>['options'] = [
    { children: <NextLink href="/">Public website</NextLink> },
    {
        onClick: () => signOut(),
        children: 'Sign out',
    },
];

export function UserActions() {
    return (
        <Menu options={userOptions}>
            <AwesomeIcon icon="user" />
        </Menu>
    );
}
