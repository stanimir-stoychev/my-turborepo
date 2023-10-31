import { AuthenticatedUserActionsToolbar } from './AuthenticatedUserActionsToolbar';

export function PublicLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <AuthenticatedUserActionsToolbar />
            {children}
        </>
    );
}

export function withPublicLayout(Component: React.ComponentType) {
    return function WithPublicLayout() {
        return (
            <PublicLayout>
                <Component />
            </PublicLayout>
        );
    };
}
