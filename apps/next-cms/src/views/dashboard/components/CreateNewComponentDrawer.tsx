import { useCallback } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useKey } from 'react-use';

import { AwesomeIcon } from '~/components';

import { CreateNewComponentForm } from './Forms';
import { DescriptionField, NameField } from './Fields';
import { useDashboardComponentsContext } from './Context';

export function OpenButton() {
    const [isCreateNewDrawerOpen, setIsCreateNewDrawerOpen] = useDashboardComponentsContext().isCreateNewDrawerOpen;

    return (
        <div className="tooltip tooltip-left" data-tip="Create new component">
            <button
                aria-label="Create new component"
                disabled={isCreateNewDrawerOpen}
                className="btn btn-accent"
                onClick={() => setIsCreateNewDrawerOpen(true)}
            >
                <AwesomeIcon icon="hand-middle-finger" />
            </button>
        </div>
    );
}

function Section({
    children,
    className,
    title,
    contentProps,
    ...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
    title: React.ReactNode;
    contentProps?: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'children'>;
}) {
    return (
        <section className={twMerge('collapse collapse-plus', className)} {...rest}>
            <input type="checkbox" />
            <div className="text-xl collapse-title">{title}</div>
            <div {...contentProps} className={twMerge('collapse-content', contentProps?.className)}>
                {children}
            </div>
        </section>
    );
}

function NameAndDescription() {
    return (
        <Section title="Name and description" contentProps={{ className: 'flex flex-col gap-2' }}>
            <NameField.FormField />
            <DescriptionField.FormField />
        </Section>
    );
}

export function CreateNewComponentDrawer() {
    const [isCreateNewDrawerOpen, setIsCreateNewDrawerOpen] = useDashboardComponentsContext().isCreateNewDrawerOpen;
    const closeDrawer = useCallback(() => setIsCreateNewDrawerOpen(false), [setIsCreateNewDrawerOpen]);

    useKey('Escape', closeDrawer, { event: 'keydown' });

    return (
        <aside
            className={clsx('fixed top-0 left-0 w-screen h-screen transition-all opacity-1 z-30', {
                'pointer-events-none -z-10 opacity-0': !isCreateNewDrawerOpen,
            })}
        >
            <div className="absolute left-0 right-0 w-full h-full cursor-default bg-slate-700/70" />
            <main className="absolute right-0 h-full px-4 py-2 rounded-l bg-base-100 min-w-56">
                <CreateNewComponentForm>
                    <NameAndDescription />
                </CreateNewComponentForm>
            </main>
        </aside>
    );
}

CreateNewComponentDrawer.OpenButton = OpenButton;
