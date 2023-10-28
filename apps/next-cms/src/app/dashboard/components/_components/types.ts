import { GRID_SIZES } from './constants';
import type { createNewComponent, greetUser } from '../_actions';

export type TGridSize = (typeof GRID_SIZES)[number];

export type TDashboardComponentsPage = {
    minSearchTermLength: [number, React.Dispatch<React.SetStateAction<number>>];
    gridSize: [TGridSize, React.Dispatch<React.SetStateAction<TGridSize>>];
    searchTerm: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    isCreateNewDrawerOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];

    serverActions: {
        greet: typeof greetUser;
        createNewComponent: typeof createNewComponent;
    };
};