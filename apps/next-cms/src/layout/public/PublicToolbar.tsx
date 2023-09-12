import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { AwesomeIcon, Menu } from '~/components';

export function PublicToolbar() {
    const { data } = useSession();

    if (!data?.user) {
        return null;
    }

    return (
        <aside data-testid="public-user-toolbar" className="flex items-center gap-1 px-2 py-1 text-black bg-secondary">
            <span className="text-sm font-semibold">{data.user.name}</span>
            <div className="flex-1" />
            <Menu
                position="bottom-left"
                options={[
                    { children: <NextLink href="/dashboard">Dashboard</NextLink> },
                    {
                        children: 'Sign out',
                        onClick: () => signOut(),
                    },
                ]}
            >
                <AwesomeIcon icon="user" />
            </Menu>
        </aside>
    );
}
