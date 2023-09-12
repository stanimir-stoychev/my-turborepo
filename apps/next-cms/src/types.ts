import type { NextPage } from 'next/types';

export type TNextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type THtmlBlockProps = {
    children?: string | THtmlBlockProps | THtmlBlockProps[];
    className?: string;
    component?: keyof JSX.IntrinsicElements;
    [ariaKey: `aria-${string}`]: string;
    [dataKey: `data-${string}`]: string;
};

export type TPage = {
    id: string;
    title: string;
    description: string;
    image?: string;
    html: THtmlBlockProps;
};
