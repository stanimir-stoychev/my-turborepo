import { useCallback } from 'react';
import clsx from 'clsx';
import { useKey } from 'react-use';

import { AwesomeIcon } from '~/components';

import { useDashboardComponentsContext } from './Context';

export function CreateNewComponentFab() {
    const [isCreateNewDrawerOpen, setIsCreateNewDrawerOpen] = useDashboardComponentsContext().isCreateNewDrawerOpen;

    return (
        <div className="tooltip tooltip-left" data-tip="Create new">
            <button
                disabled={isCreateNewDrawerOpen}
                className="btn btn-accent"
                onClick={() => setIsCreateNewDrawerOpen(true)}
            >
                <AwesomeIcon icon="hand-middle-finger" />
            </button>
        </div>
    );
}

export function CreateNewComponent() {
    const [isCreateNewDrawerOpen, setIsCreateNewDrawerOpen] = useDashboardComponentsContext().isCreateNewDrawerOpen;
    const closeDrawer = useCallback(() => setIsCreateNewDrawerOpen(false), [setIsCreateNewDrawerOpen]);

    useKey('Escape', closeDrawer, { event: 'keydown' });

    return (
        <aside
            className={clsx('fixed top-0 left-0 w-screen h-screen transition-colors opacity-1 z-30', {
                'pointer-events-none -z-10 opacity-0': !isCreateNewDrawerOpen,
            })}
        >
            <div className="absolute left-0 right-0 w-full h-full cursor-default bg-slate-700/70" />
            <section className="absolute right-0 h-full px-4 py-2 rounded-l bg-neutral">Hello!</section>
        </aside>
    );
}

CreateNewComponent.Fab = CreateNewComponentFab;
