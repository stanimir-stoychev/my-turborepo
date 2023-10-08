import { AwesomeIcon } from '~/components';
import { noop } from '~/utils/static';
import type { TDashboardComponentsPage, TGridSize } from './types';

export const DEFAULT_CONTEXT: TDashboardComponentsPage = {
    minSearchTermLength: [3, noop],
    searchTerm: [undefined, noop],
    gridSize: ['md', noop],
    isCreateNewDrawerOpen: [false, noop],
};

export const GRID_SIZES = ['sm', 'md', 'lg'] as const;

export const GRID_SIZES_ICON_PROPS: Record<TGridSize, React.ComponentProps<typeof AwesomeIcon>> = {
    sm: { icon: 'th-large' },
    md: { icon: 'th' },
    lg: { icon: 'th-list' },
};
