import { forwardRef } from 'react';
import { findIconDefinition, IconLookup } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

// https://fontawesome.com/search?o=r&m=free
// https://fontawesome.com/docs/web/style/animate#beat

config.autoAddCss = false;
library.add(fab, fas);

export interface AwesomeIconProps extends Omit<FontAwesomeIconProps, 'icon'> {
    icon: IconLookup | IconLookup['iconName'];
}

export const AwesomeIcon = forwardRef<SVGSVGElement, AwesomeIconProps>(function AwesomeIcon({ icon, ...props }, ref) {
    const iconSearch: IconLookup =
        typeof icon !== 'string'
            ? icon
            : {
                  prefix: 'fas',
                  iconName: icon,
              };

    return <FontAwesomeIcon ref={ref} icon={findIconDefinition(iconSearch)} {...props} />;
});
