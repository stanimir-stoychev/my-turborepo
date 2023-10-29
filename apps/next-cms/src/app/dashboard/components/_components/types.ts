import { GRID_SIZES } from './constants';
import type { useAction } from 'next-safe-action/hook';
import type { TComponentEntity } from '~/server/domains/components';
import type { TCreateNewComponentServerAction, TFindComponentsServerAction } from '../_actions';

export type TGridSize = (typeof GRID_SIZES)[number];

export type TDashboardComponentsPage = {
    minSearchTermLength: [number, React.Dispatch<React.SetStateAction<number>>];
    gridSize: [TGridSize, React.Dispatch<React.SetStateAction<TGridSize>>];
    searchTerm: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    isCreateNewDrawerOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];

    serverActions: {
        createNewComponent: TCreateNewComponentServerAction.Action;
        findComponents: TFindComponentsServerAction.Action;
    };

    apiData: {
        createNewComponent: ReturnType<
            typeof useAction<TCreateNewComponentServerAction.Schema, TCreateNewComponentServerAction.Data>
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
