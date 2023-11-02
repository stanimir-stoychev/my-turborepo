import { DEFAULT_CONTEXT } from './constants';
import type { TContextActions, TPageContext } from './types';

type THandleAction<A extends TContextActions.TAction = TContextActions.TAction> = (args: {
    action: A;
    state: TPageContext['state'];
}) => TPageContext['state'];

const handleSelectComponentToEdit: THandleAction<TContextActions.TSelectComponentToEdit> = ({ action, state }) => ({
    ...state,
    editComponent: {
        ...state.editComponent,
        selected: action.payload ? { ...action.payload } : undefined,
    },
});

const handleToggleCreateNewComponentDialog: THandleAction<TContextActions.TToggleCreateNewComponentDialog> = ({
    action,
    state,
}) => ({
    ...state,
    createNewComponent: {
        ...state.createNewComponent,
        isDialogOpen: action.payload ?? !state.createNewComponent.isDialogOpen,
    },
});

const handleCreateNewComponent: THandleAction<
    TContextActions.TCreateNewComponent | TContextActions.TCreateNewComponentApiChange
> = ({ action, state }) => ({
    ...state,
    createNewComponent: {
        ...state.createNewComponent,
        api: {
            ...state.createNewComponent.api,
            ...(action.type === 'create-new-component-api-change'
                ? action.payload
                : {
                      payload: { ...action.payload },
                  }),
        },
    },
});

const handleSearchComponents: THandleAction<
    TContextActions.TFindComponents | TContextActions.TFindComponentsApiChange
> = ({ action, state }) => ({
    ...state,
    findComponents: {
        ...state.findComponents,
        api: {
            ...state.findComponents.api,
            ...(action.type === 'search-components-api-change'
                ? action.payload
                : {
                      payload: { ...action.payload },
                  }),
        },
    },
});

const handleUpdateComponent: THandleAction<
    TContextActions.TUpdateComponent | TContextActions.TUpdateComponentApiChange
> = ({ action, state }) => ({
    ...state,
    editComponent: {
        ...state.editComponent,
        api: {
            ...state.editComponent.api,
            ...(action.type === 'updated-component-api-change'
                ? action.payload
                : {
                      payload: { ...action.payload },
                  }),
        },
    },
});

export const reducer = (state = DEFAULT_CONTEXT.state, action: TContextActions.TAction) => {
    switch (action.type) {
        case 'toggle-create-new-component-dialog':
            return handleToggleCreateNewComponentDialog({ action, state });
        case 'create-new-component':
        case 'create-new-component-api-change':
            return handleCreateNewComponent({ action, state });
        case 'search-components':
        case 'search-components-api-change':
            return handleSearchComponents({ action, state });
        case 'select-component-to-edit':
            return handleSelectComponentToEdit({ action, state });
        case 'update-component':
        case 'updated-component-api-change':
            return handleUpdateComponent({ action, state });
        default:
            return state;
    }
};
