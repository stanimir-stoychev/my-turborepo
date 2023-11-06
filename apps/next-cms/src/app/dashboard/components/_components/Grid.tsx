'use client';

import { Fragment, useEffect } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { AwesomeIcon } from '~/components';
import { useIntersection } from '~/utils/hooks';

import { filterOutGateWayErrors } from '../_actions';
import { FindComponentsQuery } from '../_queries';
import { GRID_SIZES, GRID_SIZES_ICON_PROPS } from './constants';
import { usePageView } from './PageView';

export function GridSizeToggle({ className, ...rest }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { gridSize, viewActions } = usePageView();
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
                    onClick={() => viewActions.setGridSize(size)}
                >
                    <AwesomeIcon {...GRID_SIZES_ICON_PROPS[size]} />
                </button>
            ))}
        </aside>
    );
}

function LoadingSkeletons() {
    return (
        <>
            {Array.from({ length: 10 }).map((_, index) => (
                <li key={index} className="shadow-xl card bg-base-200">
                    <div className="card-body animate-pulse">
                        <h2 className="card-title">
                            <div className="w-full h-6 rounded-sm bg-neutral" />
                        </h2>
                        <p className="flex flex-col gap-2 mt-2">
                            <div className="w-full h-3 rounded-sm bg-neutral" />
                            <div className="w-full h-3 rounded-sm bg-neutral" />
                            <div className="w-1/3 h-3 rounded-sm bg-neutral" />
                        </p>
                        <div className="justify-end card-actions">
                            <button disabled className="btn btn-primary btn-sm" type="button">
                                View <AwesomeIcon icon="external-link-alt" />
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </>
    );
}

export function Grid({ children, className, ...rest }: React.HtmlHTMLAttributes<HTMLUListElement>) {
    const { gridSize, searchTerm, viewActions } = usePageView();
    const loadMoreInterceptor = useIntersection({ threshold: 1 });
    const { data, isLoading, hasNextPage, fetchNextPage } = FindComponentsQuery.useInfiniteQuery(
        { any: searchTerm || '*' },
        {
            select: (data) => ({
                ...data,
                pages: filterOutGateWayErrors(data.pages),
            }),
        },
    );

    const shouldLoadNextPage = !isLoading && hasNextPage && loadMoreInterceptor.intersection?.isIntersecting;
    useEffect(() => {
        if (!shouldLoadNextPage) return;
        fetchNextPage();
    }, [shouldLoadNextPage]);

    return (
        <ul
            className={twMerge(
                clsx('group grid relative gap-4 grid-cols-1 items-start pb-10', {
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
                    {page?.items.map((component) => (
                        <li key={component.id} className="shadow-xl card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">{component.name}</h2>
                                <p>{component.description}</p>
                                <div className="justify-end card-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        type="button"
                                        onClick={() => viewActions.setEditComponent(component)}
                                    >
                                        View <AwesomeIcon icon="external-link-alt" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </Fragment>
            ))}

            {isLoading && <LoadingSkeletons />}

            {hasNextPage && !isLoading && (
                <li
                    className="shadow-xl card bg-base-200"
                    id="infinite-scroll-capturer"
                    ref={loadMoreInterceptor.captureIntersectionElement}
                />
            )}
        </ul>
    );
}
