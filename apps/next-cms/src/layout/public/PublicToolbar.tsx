import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { AwesomeIcon } from '~/components';

export function PublicToolbar() {
    const { data } = useSession();

    if (!data?.user) {
        return null;
    }

    return (
        <aside data-testid="public-user-toolbar" className="flex items-center gap-1 px-2 py-1 bg-neutral">
            <span className="text-sm font-semibold">{data.user.name}</span>
            <div className="flex-1" />
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="cursor-pointer">
                    {data?.user?.image ? (
                        <img src={data.user.image} alt="User avatar" className="w-8 rounded" />
                    ) : (
                        <AwesomeIcon icon="user" />
                    )}
                </label>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <NextLink href="/dashboard" className="link link-hover">
                            Dashboard
                        </NextLink>
                    </li>
                    <li>
                        <button onClick={() => signOut()}>Sign out</button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
