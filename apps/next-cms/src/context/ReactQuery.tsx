'use client';

import { cache, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const getQueryClient = cache(() => new QueryClient());

export function ReactQueryClientProvider({ children, client }: React.PropsWithChildren<{ client?: QueryClient }>) {
    const queryClient = client ?? getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools buttonPosition="top-right" />
        </QueryClientProvider>
    );
}
