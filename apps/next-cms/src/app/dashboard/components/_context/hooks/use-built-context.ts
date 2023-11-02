import { useEffect, useReducer } from 'react';
import { useEffectOnce } from 'react-use';
import { useAction } from 'next-safe-action/hook';

import {
    createNewComponentServerAction,
    findComponentsServerAction,
    updateComponentServerAction,
} from '../../_actions';

import { DEFAULT_CONTEXT } from '../constants';
import { reducer } from '../reducer';

import type { TPageContext } from '../types';

const SAFE_ACTION_STATUS_MAPPER = {
    idle: 'idle',
    executing: 'pending',
    hasSucceeded: 'success',
    hasErrored: 'error',
} as const;

// export function useBuiltContext(serverActions: TUseServerActionsArgs): TPageContext {
export function useBuiltContext(): TPageContext {
    const safeCreateNewComponentAction = useAction(createNewComponentServerAction);
    const safeUpdateComponentAction = useAction(updateComponentServerAction);
    const safeFindComponentsAction = useAction(findComponentsServerAction);

    const [reactState, reactDispatch] = useReducer(reducer, DEFAULT_CONTEXT.state);
    const dispatch: typeof DEFAULT_CONTEXT.dispatch = (action) => {
        reactDispatch(action);

        if (action.type === 'create-new-component' && safeCreateNewComponentAction.status !== 'executing') {
            safeCreateNewComponentAction.execute(action.payload);
        }

        if (action.type === 'search-components' && safeFindComponentsAction.status !== 'executing') {
            safeFindComponentsAction.execute(action.payload ?? { any: '*' });
        }

        if (action.type === 'update-component' && safeUpdateComponentAction.status !== 'executing') {
            safeUpdateComponentAction.execute(action.payload);
        }

        if (action.type === 'reset-create-new-component-api-data') {
            safeCreateNewComponentAction.reset();
        }

        if (action.type === 'reset-search-components-api-data') {
            safeFindComponentsAction.reset();
        }

        if (action.type === 'reset-updated-component-api-data') {
            safeUpdateComponentAction.reset();
        }
    };

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeCreateNewComponentAction.status];
        const data = safeCreateNewComponentAction.result.data;

        reactDispatch({
            type: 'create-new-component-api-change',
            payload: { data, status },
        });
    }, [safeCreateNewComponentAction.result, safeCreateNewComponentAction.status]);

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeFindComponentsAction.status];
        const data = safeFindComponentsAction.result.data;

        reactDispatch({
            type: 'search-components-api-change',
            payload: { data, status },
        });
    }, [safeFindComponentsAction.result, safeFindComponentsAction.status]);

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeUpdateComponentAction.status];
        const data = safeUpdateComponentAction.result.data;

        reactDispatch({
            type: 'updated-component-api-change',
            payload: { data, status },
        });
    }, [safeUpdateComponentAction.result, safeUpdateComponentAction.status]);

    useEffectOnce(() => {
        dispatch({ type: 'search-components' });
    });

    return {
        dispatch,
        state: reactState,
    };
}
