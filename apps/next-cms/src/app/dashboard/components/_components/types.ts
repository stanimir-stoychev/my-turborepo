import { GRID_SIZES } from './constants';
import type { useAction } from 'next-safe-action/hook';
import type { TComponentEntity } from '~/server/domains/components';
import type {
    TCreateNewComponentServerAction,
    TFindComponentsServerAction,
    TUpdateComponentServerAction,
} from '../_actions';

export type TGridSize = (typeof GRID_SIZES)[number];

export type TDashboardComponentsPage = {
    minSearchTermLength: [number, React.Dispatch<React.SetStateAction<number>>];
    gridSize: [TGridSize, React.Dispatch<React.SetStateAction<TGridSize>>];
    searchTerm: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    isCreateNewDrawerOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];

    drawer: {
        ['create-new-component']: {
            isOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
            defaultValues: [
                TCreateNewComponentServerAction.TSchema,
                React.Dispatch<React.SetStateAction<TCreateNewComponentServerAction.TSchema>>,
            ];
        };

        ['update-component']: {
            isOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
            defaultValues: [
                TUpdateComponentServerAction.TSchema,
                React.Dispatch<React.SetStateAction<TUpdateComponentServerAction.TSchema>>,
            ];
        };
    };

    serverActions: {
        createNewComponent: TCreateNewComponentServerAction.Action;
        updateComponent: TUpdateComponentServerAction.Action;
        findComponents: TFindComponentsServerAction.Action;
    };

    apiData: {
        createNewComponent: ReturnType<
            typeof useAction<TCreateNewComponentServerAction.Schema, TCreateNewComponentServerAction.Data>
        >;

        updateComponent: ReturnType<
            typeof useAction<TUpdateComponentServerAction.Schema, TUpdateComponentServerAction.Data>
        >;

        findComponents: {
            data: TFindComponentsServerAction.Data[];
            fetchNextPage: () => void;
            hasNextPage: boolean;
            isLoading: boolean;
        };
    };
};

export type THtmlComponent = Pick<TComponentEntity, 'html' | 'htmlProps'>;
