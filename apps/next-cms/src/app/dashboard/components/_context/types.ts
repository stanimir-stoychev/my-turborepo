import type {
    TCreateNewComponentServerAction,
    TFindComponentsServerAction,
    TUpdateComponentServerAction,
} from '../_actions';

export namespace TContextActions {
    export type TToggleCreateNewComponentDialog = {
        type: 'toggle-create-new-component-dialog';
        payload?: boolean;
    };

    export type TCreateNewComponent = {
        type: 'create-new-component';
        payload: TCreateNewComponentServerAction.TSchema;
    };

    export type TCreateNewComponentApiChange = {
        type: 'create-new-component-api-change';
        payload: TPageContext['state']['createNewComponent']['api'];
    };

    export type TFindComponents = {
        type: 'search-components';
        payload?: TFindComponentsServerAction.TSchema;
    };

    // Should take a look later...
    export type TFindComponentsApiChange = {
        type: 'search-components-api-change';
        payload: TPageContext['state']['findComponents']['api'];
    };

    export type TSelectComponentToEdit = {
        type: 'select-component-to-edit';
        payload: TPageContext['state']['editComponent']['selected'];
    };

    export type TUpdateComponent = {
        type: 'update-component';
        payload: TUpdateComponentServerAction.TSchema;
    };

    export type TUpdateComponentApiChange = {
        type: 'updated-component-api-change';
        payload: TPageContext['state']['editComponent']['api'];
    };

    export type TResetApiData = {
        type:
            | 'reset-create-new-component-api-data'
            | 'reset-search-components-api-data'
            | 'reset-updated-component-api-data';
    };

    export type TAction =
        | TCreateNewComponent
        | TCreateNewComponentApiChange
        | TFindComponents
        | TFindComponentsApiChange
        | TSelectComponentToEdit
        | TToggleCreateNewComponentDialog
        | TUpdateComponent
        | TUpdateComponentApiChange
        | TResetApiData;

    export type TPageComponentAction =
        | TCreateNewComponent
        | TFindComponents
        | TSelectComponentToEdit
        | TToggleCreateNewComponentDialog
        | TUpdateComponent
        | TResetApiData;
}

export type TPageContext = {
    dispatch: (action: TContextActions.TPageComponentAction) => void;
    state: {
        createNewComponent: {
            isDialogOpen: boolean;
            defaultValues?: TCreateNewComponentServerAction.TSchema;
            api: {
                payload?: TCreateNewComponentServerAction.TSchema;
                status: 'idle' | 'pending' | 'success' | 'error';
                data?: TCreateNewComponentServerAction.Data;
            };
        };

        editComponent: {
            selected?: TUpdateComponentServerAction.TSchema;
            api: {
                payload?: TUpdateComponentServerAction.TSchema;
                status: 'idle' | 'pending' | 'success' | 'error';
                data?: TUpdateComponentServerAction.Data;
            };
        };

        findComponents: {
            query?: TFindComponentsServerAction.TSchema;
            api: {
                payload?: TFindComponentsServerAction.TSchema;
                status: 'idle' | 'pending' | 'success' | 'error';
                data?: TFindComponentsServerAction.Data;
            };
        };
    };
};

export type TUseServerActionsArgs = {
    createNewComponent: TCreateNewComponentServerAction.Action;
    findComponents: TFindComponentsServerAction.Action;
    updateComponent: TUpdateComponentServerAction.Action;
};
