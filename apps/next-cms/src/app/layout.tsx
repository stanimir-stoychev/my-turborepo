'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ReactQueryClientProvider, ThemeProvider } from '~/context';
import { DashboardLayout, PublicLayout } from '~/layout';
import '~/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const PageLayout = pathname.startsWith('/dashboard') ? DashboardLayout : PublicLayout;

    return (
        <html lang="en">
            <body className="selection:bg-secondary/50 selection:text-primary/80">
                <SessionProvider>
                    <ReactQueryClientProvider>
                        <ThemeProvider>
                            <PageLayout>{children}</PageLayout>
                        </ThemeProvider>
                    </ReactQueryClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
