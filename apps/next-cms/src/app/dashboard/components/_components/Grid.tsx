'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { AwesomeIcon } from '~/components';

import { GRID_SIZES, GRID_SIZES_ICON_PROPS } from './constants';
import { usePageContext } from '../_context';

export function GridSizeToggle({ className, ...rest }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { dispatch, state } = usePageContext();
    const gridSize = state.grid.size;
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
                    className={clsx('tab tab-sm', size === gridSize && 'tab-active')}
                    onClick={() =>
                        dispatch({
                            type: 'change-grid-size',
                            payload: size,
                        })
                    }
                >
                    <AwesomeIcon {...GRID_SIZES_ICON_PROPS[size]} />
                </button>
            ))}
        </aside>
    );
}

export function Grid({ children, className, ...rest }: React.HtmlHTMLAttributes<HTMLUListElement>) {
    const { dispatch, state } = usePageContext();
    const data = state.findComponents.api.data;
    const gridSize = state.grid.size;

    return (
        <ul
            className={twMerge(
                clsx('group grid relative gap-2 grid-cols-1 items-start pb-10', {
                    'md:grid-cols-2': gridSize === GRID_SIZES[0],
                    'md:grid-cols-3': gridSize === GRID_SIZES[1],
                    'md:grid-cols-5': gridSize === GRID_SIZES[2],
                }),
                className,
            )}
            {...rest}
        >
            {data?.items.map((component) => (
                <li key={component.id} className="shadow-xl card bg-base-200">
                    <div className="card-body">
                        <h2 className="card-title">{component.name}</h2>
                        <p>{component.description}</p>
                        <div className="justify-end card-actions">
                            <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={() =>
                                    dispatch({
                                        type: 'select-component-to-edit',
                                        payload: component,
                                    })
                                }
                            >
                                View <AwesomeIcon icon="external-link-alt" />
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
