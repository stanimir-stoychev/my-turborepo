import type { NextPage } from 'next/types';

export type TNextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};
