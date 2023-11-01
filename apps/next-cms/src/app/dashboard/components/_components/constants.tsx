import { AwesomeIcon } from '~/components';
import { noop } from '~/utils/static';
import type { TDashboardComponentsPage, TGridSize } from './types';

export const DEFAULT_CONTEXT: TDashboardComponentsPage = {
    minSearchTermLength: [3, noop],
    searchTerm: [undefined, noop],
    gridSize: ['md', noop],
    isCreateNewDrawerOpen: [false, noop],
    serverActions: {
        createNewComponent: noop as any,
        updateComponent: noop as any,
        findComponents: noop as any,
    },
    apiData: {
        createNewComponent: {
            execute: noop,
            reset: noop,
            result: {},
            status: 'idle',
        },
        updateComponent: {
            execute: noop,
            reset: noop,
            result: {},
            status: 'idle',
        },
        findComponents: {
            data: [],
            fetchNextPage: noop,
            hasNextPage: false,
            isLoading: false,
        },
    },
};

export const GRID_SIZES = ['sm', 'md', 'lg'] as const;

export const GRID_SIZES_ICON_PROPS: Record<TGridSize, React.ComponentProps<typeof AwesomeIcon>> = {
    sm: { icon: 'th-large' },
    md: { icon: 'th' },
    lg: { icon: 'th-list' },
};
