'use client';

import { createContext, useContext, useState } from 'react';

import { DEFAULT_CONTEXT } from './constants';
import type { TDashboardComponentsPage } from './types';

const Context = createContext(DEFAULT_CONTEXT);
Context.displayName = 'views/dashboard/components';

export const useDashboardComponentsContext = () => useContext(Context);

export function DashboardComponentsProvider({
    children,
    serverActions,
}: React.PropsWithChildren<Pick<TDashboardComponentsPage, 'serverActions'>>) {
    const context: TDashboardComponentsPage = {
        serverActions,
        minSearchTermLength: useState(DEFAULT_CONTEXT.minSearchTermLength[0]),
        gridSize: useState(DEFAULT_CONTEXT.gridSize[0]),
        searchTerm: useState(DEFAULT_CONTEXT.searchTerm[0]),
        isCreateNewDrawerOpen: useState(DEFAULT_CONTEXT.isCreateNewDrawerOpen[0]),
    };

    return <Context.Provider value={context}>{children}</Context.Provider>;
}
