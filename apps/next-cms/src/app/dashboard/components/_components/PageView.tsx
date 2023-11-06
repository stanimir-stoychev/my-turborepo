'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
import { noop } from '~/utils/static';
import type { TComponentEntity } from '~/server/domains/components';

export type TPageView = {
    createNewComponent?: boolean;
    editComponent?: TComponentEntity;
    gridSize: 'sm' | 'md' | 'lg';
    searchTerm?: string;

    viewActions: {
        setCreateNewComponent: (createNewComponent: TPageView['createNewComponent']) => void;
        setEditComponent: (editComponent: TPageView['editComponent']) => void;
        setGridSize: (gridSize: TPageView['gridSize']) => void;
        setSearchTerm: (searchTerm: TPageView['searchTerm']) => void;
    };
};

const DEFAULT_PAGE_VIEW: TPageView = {
    gridSize: 'md',
    viewActions: {
        setCreateNewComponent: noop,
        setEditComponent: noop,
        setGridSize: noop,
        setSearchTerm: noop,
    },
};

const Context = createContext(DEFAULT_PAGE_VIEW);
Context.displayName = 'PageViewContext dashboard/components';

type TSetCreateNewComponentAction = { type: 'SET_CREATE_NEW_COMPONENT'; payload: TPageView['createNewComponent'] };
type TSetEditComponentAction = { type: 'SET-EDIT-COMPONENT'; payload: TPageView['editComponent'] };
type TSetGridSizeAction = { type: 'SET-GRID-SIZE'; payload: TPageView['gridSize'] };
type TSetSearchTermAction = { type: 'SET-SEARCH-TERM'; payload: TPageView['searchTerm'] };
type TPageViewActions =
    | TSetCreateNewComponentAction
    | TSetEditComponentAction
    | TSetGridSizeAction
    | TSetSearchTermAction;

const reducer = (state: Omit<TPageView, 'viewActions'> = DEFAULT_PAGE_VIEW, action: TPageViewActions) => {
    switch (action.type) {
        case 'SET-GRID-SIZE':
            return { ...state, gridSize: action.payload };
        case 'SET-SEARCH-TERM':
            return { ...state, searchTerm: action.payload };
        case 'SET-EDIT-COMPONENT':
            return { ...state, editComponent: action.payload };
        case 'SET_CREATE_NEW_COMPONENT':
            return { ...state, createNewComponent: action.payload };
        default:
            return state;
    }
};

export const usePageView = () => useContext(Context);

export const PageViewProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, DEFAULT_PAGE_VIEW);
    const viewActions: TPageView['viewActions'] = useMemo(
        () => ({
            setCreateNewComponent: (createNewComponent) =>
                dispatch({ type: 'SET_CREATE_NEW_COMPONENT', payload: createNewComponent }),
            setEditComponent: (editComponent) => dispatch({ type: 'SET-EDIT-COMPONENT', payload: editComponent }),
            setGridSize: (gridSize) => dispatch({ type: 'SET-GRID-SIZE', payload: gridSize }),
            setSearchTerm: (searchTerm) => dispatch({ type: 'SET-SEARCH-TERM', payload: searchTerm }),
        }),
        [dispatch],
    );

    const ctx = useMemo(() => ({ ...state, viewActions }), [state, viewActions]);
    return <Context.Provider value={ctx}>{children}</Context.Provider>;
};
