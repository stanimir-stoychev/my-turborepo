import { AwesomeIcon } from '~/components';
import type { TGridSize } from './types';

export const GRID_SIZES = ['sm', 'md', 'lg'] as const;

export const GRID_SIZES_ICON_PROPS: Record<TGridSize, React.ComponentProps<typeof AwesomeIcon>> = {
    sm: { icon: 'th-large' },
    md: { icon: 'th' },
    lg: { icon: 'th-list' },
};
