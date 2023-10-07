import { useSession } from 'next-auth/react';
import { DashboardToolbar } from './DashboardToolbar';
import { DashboardToasterProvider } from './DashboardToaster';

export function DashboardLayout({ children }: React.PropsWithChildren) {
    const { status } = useSession();

    if (status === 'loading') {
        return <>Loading...</>;
    }

    return (
        <div className="flex w-screen h-screen gap-2 [&>main]:flex-1 [&>main]:h-full [&>main]:overflow-auto relative">
            <DashboardToasterProvider>
                <DashboardToolbar />
                {children}
            </DashboardToasterProvider>
        </div>
    );
}
