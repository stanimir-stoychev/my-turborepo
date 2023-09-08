import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/app/_lib';

export async function AuthenticatedUserProvider({ children }: React.PropsWithChildren) {
    const session = await getServerSession();

    if (!session || !session.user) {
        const headersList = headers();
        const url = headersList.get('x-url');
        const callbackUrl = url ? `?callbackUrl=${encodeURIComponent(url)}` : '';

        redirect(`/api/auth/signin${callbackUrl}`);
    }

    return <>{children}</>;
}

export function withAuthenticatedUserProvider(Component: React.ComponentType) {
    return function WithAuthenticatedUserProvider() {
        return (
            <AuthenticatedUserProvider>
                <Component />
            </AuthenticatedUserProvider>
        );
    };
}
