import { Fragment } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { api } from '~/utils/api';
import { AwesomeIcon } from '~/components';

import { GRID_SIZES, GRID_SIZES_ICON_PROPS } from './constants';
import { useDashboardComponentsContext } from './Context';

function SizeToggle({ className, ...rest }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const [currentSize, setSize] = useDashboardComponentsContext().gridSize;
    return (
        <aside
            aria-label="Size toggle"
            className={twMerge(
                'transition-all opacity-0 pointer-events-none tabs tabs-boxed md:pointer-events-auto md:opacity-100',
                className,
            )}
            {...rest}
        >
            {GRID_SIZES.map((size) => (
                <button
                    key={size}
                    className={clsx('tab tab-sm', size === currentSize && 'tab-active')}
                    onClick={() => setSize(size)}
                >
                    <AwesomeIcon {...GRID_SIZES_ICON_PROPS[size]} />
                </button>
            ))}
        </aside>
    );
}

export function Grid({ children, className, ...rest }: React.HtmlHTMLAttributes<HTMLUListElement>) {
    const [gridSize] = useDashboardComponentsContext().gridSize;
    const [searchTerm] = useDashboardComponentsContext().searchTerm;
    const { data } = api.component.find.useInfiniteQuery({
        query: { any: searchTerm || '*' },
    });

    return (
        <ul
            className={twMerge(
                clsx('group grid relative gap-2 grid-cols-1 pb-10', {
                    'md:grid-cols-2': gridSize === GRID_SIZES[0],
                    'md:grid-cols-3': gridSize === GRID_SIZES[1],
                    'md:grid-cols-5': gridSize === GRID_SIZES[2],
                }),
                className,
            )}
            {...rest}
        >
            {data?.pages.map((page, index) => (
                <Fragment key={index}>
                    {page.items.map((component) => (
                        <li key={component.id} className="h-64 mockup-code">
                            <pre>
                                <code>{JSON.stringify(component, null, 4)}</code>
                            </pre>
                        </li>
                    ))}
                </Fragment>
            ))}
        </ul>
    );
}

Grid.SizeToggle = SizeToggle;
