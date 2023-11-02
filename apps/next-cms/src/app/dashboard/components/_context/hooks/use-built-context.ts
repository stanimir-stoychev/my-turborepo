import { useEffect, useReducer, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { useAction } from 'next-safe-action/hook';

import {
    createNewComponentServerAction,
    findComponentsServerAction,
    updateComponentServerAction,
} from '../../_actions';

import { DEFAULT_CONTEXT } from '../constants';
import { reducer } from '../reducer';

import { TContextActions, type TPageContext } from '../types';

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

    const lastCallPayloadsMapRef = useRef(new Map<TContextActions.TAction['type'], any>());
    const [reactState, reactDispatch] = useReducer(reducer, DEFAULT_CONTEXT.state);
    const dispatch: typeof DEFAULT_CONTEXT.dispatch = (action) => {
        reactDispatch(action);

        if (action.type === 'create-new-component' && safeCreateNewComponentAction.status !== 'executing') {
            const apiPayload = action.payload;
            lastCallPayloadsMapRef.current.set(action.type, apiPayload);
            safeCreateNewComponentAction.execute(apiPayload);
        }

        if (action.type === 'search-components' && safeFindComponentsAction.status !== 'executing') {
            const apiPayload = action.payload ?? { any: '*' };
            lastCallPayloadsMapRef.current.set(action.type, apiPayload);
            safeFindComponentsAction.execute(apiPayload);
        }

        if (action.type === 'update-component' && safeUpdateComponentAction.status !== 'executing') {
            const apiPayload = action.payload;
            lastCallPayloadsMapRef.current.set(action.type, apiPayload);
            safeUpdateComponentAction.execute(apiPayload);
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

        if (action.type === 'retry-last-create-new-component-api-call') {
            const apiPayload = lastCallPayloadsMapRef.current.get('create-new-component');
            if (apiPayload) {
                safeCreateNewComponentAction.execute(apiPayload);
            }
        }

        if (action.type === 'retry-last-search-components-api-call') {
            const apiPayload = lastCallPayloadsMapRef.current.get('search-components');
            if (apiPayload) {
                safeFindComponentsAction.execute(apiPayload);
            }
        }

        if (action.type === 'retry-last-updated-component-api-call') {
            const apiPayload = lastCallPayloadsMapRef.current.get('update-component');
            if (apiPayload) {
                safeUpdateComponentAction.execute(apiPayload);
            }
        }
    };

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeCreateNewComponentAction.status];
        const data = safeCreateNewComponentAction.result.data;

        if (
            reactState.createNewComponent.api.status === status &&
            JSON.stringify(reactState.createNewComponent.api.data) ===
                JSON.stringify(safeCreateNewComponentAction.result.data)
        )
            return;

        reactDispatch({
            type: 'create-new-component-api-change',
            payload: { data, status },
        });
    }, [safeCreateNewComponentAction.status]);

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeFindComponentsAction.status];
        const data = safeFindComponentsAction.result.data;

        if (
            reactState.findComponents.api.status === status &&
            JSON.stringify(reactState.findComponents.api.data) === JSON.stringify(safeFindComponentsAction.result.data)
        )
            return;

        reactDispatch({
            type: 'search-components-api-change',
            payload: { data, status },
        });
    }, [safeFindComponentsAction.status]);

    useEffect(() => {
        const status = SAFE_ACTION_STATUS_MAPPER[safeUpdateComponentAction.status];
        const data = safeUpdateComponentAction.result.data;

        if (
            reactState.editComponent.api.status === status &&
            JSON.stringify(reactState.editComponent.api.data) === JSON.stringify(safeUpdateComponentAction.result.data)
        )
            return;

        reactDispatch({
            type: 'updated-component-api-change',
            payload: { data, status },
        });
    }, [safeUpdateComponentAction.status]);

    useEffectOnce(() => {
        if (reactState.findComponents.api.data || reactState.findComponents.api.status !== 'idle') {
            return;
        }

        dispatch({
            type: 'search-components',
            payload: { any: '*' },
        });
    });

    return {
        dispatch,
        state: reactState,
    };
}
