import clsx from 'clsx';
import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { AwesomeIcon } from '~/components';

function ToolbarLink({
    className,
    iconProps,
    tooltip,
    ...rest
}: Omit<React.ComponentProps<typeof NextLink>, 'children'> & {
    iconProps: React.ComponentProps<typeof AwesomeIcon>;
    tooltip?: string;
}) {
    return (
        <NextLink
            className={clsx('link link-primary group', className, tooltip && 'tooltip tooltip-right tooltip-accent')}
            data-tip={tooltip}
            {...rest}
        >
            <AwesomeIcon
                size="2x"
                {...iconProps}
                className={clsx('transition-all group-hover:scale-110 group-hover:shadow-lg', iconProps.className)}
            />
        </NextLink>
    );
}

function UserMenu() {
    const { data } = useSession();

    return (
        <div
            className="dropdown dropdown-right dropdown-end tooltip tooltip-right tooltip-accent"
            data-tip={data?.user?.name}
        >
            <label tabIndex={0} className="cursor-pointer">
                {data?.user?.image ? (
                    <img src={data.user.image} alt="User avatar" className="w-8 rounded" />
                ) : (
                    <AwesomeIcon icon="user" />
                )}
            </label>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <NextLink href="/" className="link link-hover">
                        Public website
                    </NextLink>
                </li>
                <li>
                    <button onClick={() => signOut()}>Sign out</button>
                </li>
            </ul>
        </div>
    );
}

export function DashboardToolbar() {
    return (
        <header
            className="flex flex-col gap-2 px-3 py-2 shadow-md bg-neutral rounded-e text-primary"
            data-testid="dashboard-header"
        >
            <ToolbarLink href="/dashboard" iconProps={{ icon: 'poo' }} tooltip="Dashboard" />
            <hr className="my-4" />
            <ToolbarLink href="/dashboard/components" iconProps={{ icon: 'cubes', size: 'lg' }} tooltip="Components" />
            <div className="flex-1" />
            <UserMenu />
        </header>
    );
}
