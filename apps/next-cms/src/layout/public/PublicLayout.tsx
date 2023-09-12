import { PublicToolbar } from './PublicToolbar';

export function PublicLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicToolbar />
            <main data-testid="public-content">{children}</main>
        </div>
    );
}
