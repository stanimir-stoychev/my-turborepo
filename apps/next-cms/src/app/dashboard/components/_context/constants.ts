import { noop } from '~/utils/static';
import type { TPageContext } from './types';

export const DEFAULT_CONTEXT: TPageContext = {
    dispatch: noop,
    state: {
        createNewComponent: {
            isDialogOpen: false,
            defaultValues: undefined,
            api: {
                payload: undefined,
                status: 'idle',
                data: undefined,
            },
        },

        editComponent: {
            selected: undefined,
            api: {
                payload: undefined,
                status: 'idle',
                data: undefined,
            },
        },

        findComponents: {
            query: undefined,
            api: {
                payload: undefined,
                status: 'idle',
                data: undefined,
            },
        },
    },
};
