import { signIn, useSession } from 'next-auth/react';
import { DashboardToolbar } from './DashboardToolbar';

export function DashboardLayout({ children }: React.PropsWithChildren) {
    const { status } = useSession();

    if (status === 'loading') {
        return <>Loading...</>;
    }

    return (
        <div className="flex w-screen h-screen gap-2">
            <DashboardToolbar />
            <main data-testid="dashboard-content" className="flex-1">
                {children}
            </main>
        </div>
    );
}
