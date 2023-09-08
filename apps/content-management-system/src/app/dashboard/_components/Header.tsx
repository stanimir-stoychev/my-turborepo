import NextLink from 'next/link';

import { AwesomeIcon } from '@/app/_components';
import { UserActions } from './UserActions';

export function Header() {
    return (
        <header className="flex items-center gap-2 px-3 py-2 text-black bg-primary" data-testid="dashboard-header">
            <AwesomeIcon icon="bars" />
            <NextLink href="/dashboard">Content Management System</NextLink>
            <div className="flex-1" />
            <UserActions />
        </header>
    );
}
