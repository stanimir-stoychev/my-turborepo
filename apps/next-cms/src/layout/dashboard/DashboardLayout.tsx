import { useSession } from 'next-auth/react';
import { DashboardToolbar } from './DashboardToolbar';
import { ToasterProvider } from '../Toaster';

export function DashboardLayout({ children }: React.PropsWithChildren) {
    const { status } = useSession();

    if (status === 'loading') {
        return <>Loading...</>;
    }

    return (
        <div className="flex w-screen h-screen gap-2 [&>main]:flex-1 [&>main]:h-full [&>main]:overflow-auto relative">
            <ToasterProvider>
                <DashboardToolbar />
                {children}
            </ToasterProvider>
        </div>
    );
}

DashboardLayout.displayName = 'layout/Dashboard';
