import { AwesomeIcon } from '~/components';

export const GRID_SIZES = ['sm', 'md', 'lg'] as const;

export const GRID_SIZES_ICON_PROPS: Record<(typeof GRID_SIZES)[number], React.ComponentProps<typeof AwesomeIcon>> = {
    sm: { icon: 'th-large' },
    md: { icon: 'th' },
    lg: { icon: 'th-list' },
};
