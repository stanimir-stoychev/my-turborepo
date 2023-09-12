import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import clsx from 'clsx';

import { AwesomeIcon, Menu } from '~/components';

function ToolbarLink({
    className,
    iconProps,
    tooltip,
    ...rest
}: Omit<React.ComponentProps<typeof NextLink>, 'children'> & {
    iconProps: React.ComponentProps<typeof AwesomeIcon>;
    tooltip?: React.ReactNode;
}) {
    return (
        <NextLink className={clsx('text-center group', className, tooltip && 'has-tooltip')} {...rest}>
            <AwesomeIcon
                size="2x"
                {...iconProps}
                className={clsx(
                    'transition-all group-hover:scale-110 group-hover:shadow-lg group-active:scale-110 group-active:shadow-lg group-focus:scale-110 group-focus:shadow-lg',
                    iconProps.className,
                )}
            />
            {tooltip && (
                <div className="px-1 text-black -translate-y-1/2 rounded shadow-lg pointer-events-none top-1/2 bg-primary left-[120%] min-w-max group-hover:pointer-events-auto tooltip">
                    {tooltip}
                </div>
            )}
        </NextLink>
    );
}

function UserMenu() {
    const { data } = useSession();

    return (
        <Menu
            data-testid="user-menu"
            position="top-right"
            className="text-center"
            btnProps={{
                className:
                    'group has-tooltip hover:scale-110 transition-all hover:shadow-lg active:scale-110 active:shadow-lg focus:scale-110 focus:shadow-lg',
            }}
            options={[
                { children: <NextLink href="/">Public website</NextLink> },
                {
                    onClick: () => signOut(),
                    children: 'Sign out',
                },
            ]}
        >
            {data?.user?.image ? (
                <img src={data.user.image} alt="User avatar" className="w-8 rounded" />
            ) : (
                <AwesomeIcon icon="user" />
            )}
            <span className="top-1/2 -translate-y-1/2 p-1 text-black rounded shadow-lg pointer-events-none bg-primary left-[120%] min-w-max group-hover:pointer-events-auto tooltip">
                {data?.user?.name}
            </span>
        </Menu>
    );
}

export function DashboardToolbar() {
    const { data } = useSession();

    return (
        <header
            className="flex flex-col gap-2 px-3 py-2 shadow-md bg-secondary rounded-e text-primary"
            data-testid="dashboard-header"
        >
            <ToolbarLink href="/dashboard" iconProps={{ icon: 'poo' }} tooltip="Dashboard" />
            <hr className="my-4" />
            <ToolbarLink href="/dashboard/pages" iconProps={{ icon: 'book-bookmark', size: 'lg' }} tooltip="Pages" />
            <div className="flex-1" />
            <UserMenu />
        </header>
    );
}
