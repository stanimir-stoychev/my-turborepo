'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hook';

import { DEFAULT_CONTEXT } from './constants';
import type { TDashboardComponentsPage } from './types';

const Context = createContext(DEFAULT_CONTEXT);
Context.displayName = 'dashboard/components (Page context)';

const useInfiniteFindComponents = ({
    searchTerm,
    serverAction,
}: {
    searchTerm: TDashboardComponentsPage['searchTerm'][0];
    serverAction: TDashboardComponentsPage['serverActions']['findComponents'];
}): TDashboardComponentsPage['apiData']['findComponents'] => {
    const { execute, result, status } = useAction(serverAction);
    const [data, setData] = useState([] as TDashboardComponentsPage['apiData']['findComponents']['data']);
    const [prevSearchTerm, setPrevSearchTerm] = useState<typeof searchTerm>('invalid search to trigger flow...');

    const fetchNextPage = useCallback(() => {
        if (status === 'executing') return;
        execute({
            any: searchTerm || '*',
            cursor: result.data?.nextCursor,
        });
    }, [searchTerm, result.data?.nextCursor, status, execute]);

    useEffect(() => {
        const newData = result.data;
        const lastEntry = data[data.length - 1];

        if (!newData) return;
        if (lastEntry?.nextCursor === newData?.nextCursor && lastEntry?.total === newData.total) return;

        setData((prevData) => [...prevData, newData]);
    }, [result.data]);

    useEffect(() => {
        if (prevSearchTerm === searchTerm) return;

        setPrevSearchTerm(searchTerm);
        setData([]);
        fetchNextPage();
    }, [searchTerm]);

    return {
        data,
        fetchNextPage,
        hasNextPage: typeof result.data?.nextCursor !== 'undefined',
        isLoading: status === 'executing',
    };
};

export const useDashboardComponentsContext = () => useContext(Context);

export function DashboardComponentsProvider({
    children,
    serverActions,
}: React.PropsWithChildren<Pick<TDashboardComponentsPage, 'serverActions'>>) {
    const searchTerm = useState(DEFAULT_CONTEXT.searchTerm[0]);
    const context: TDashboardComponentsPage = {
        minSearchTermLength: useState(DEFAULT_CONTEXT.minSearchTermLength[0]),
        gridSize: useState(DEFAULT_CONTEXT.gridSize[0]),
        searchTerm,
        isCreateNewDrawerOpen: useState(DEFAULT_CONTEXT.isCreateNewDrawerOpen[0]),
        serverActions,
        apiData: {
            createNewComponent: useAction(serverActions.createNewComponent),
            updateComponent: useAction(serverActions.updateComponent),
            findComponents: useInfiniteFindComponents({
                searchTerm: searchTerm[0],
                serverAction: serverActions.findComponents,
            }),
        },
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
}
