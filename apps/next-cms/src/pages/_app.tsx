import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';
import { DashboardLayout, PublicLayout } from '~/layout';
import { ThemeProvider } from '~/context';

import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import type { TNextPageWithLayout } from '~/types';

import '~/styles/globals.css';

type AppPropsWithLayout = AppProps & {
    Component: TNextPageWithLayout;
    session: Session | null;
};

const fallbackGetLayout: TNextPageWithLayout['getLayout'] = (page) => page;

const NextCMSApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? fallbackGetLayout;
    const { pathname } = useRouter();
    const PageLayout = pathname.startsWith('/dashboard') ? DashboardLayout : PublicLayout;

    return (
        <SessionProvider session={session}>
            <ThemeProvider>
                <PageLayout>{getLayout(<Component {...pageProps} />)}</PageLayout>
            </ThemeProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(NextCMSApp);
