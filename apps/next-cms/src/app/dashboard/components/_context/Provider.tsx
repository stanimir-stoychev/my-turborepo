'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_CONTEXT } from './constants';
import { useBuiltContext } from './hooks';

const Context = createContext(DEFAULT_CONTEXT);
Context.displayName = 'dashboard/components/page Page context';

export const usePageContext = () => useContext(Context);

export function PageContextProvider({ children }: React.PropsWithChildren) {
    const ctx = useBuiltContext();
    return <Context.Provider value={ctx}>{children}</Context.Provider>;
}
