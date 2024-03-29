'use client';

import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useKey, useToggle } from 'react-use';

import { AwesomeIcon } from '~/components';

import { CreateNewComponentForm } from './Forms';
import { ComponentHtmlField, DescriptionField, NameField, SeoDescriptionField, SeoNameField } from './Fields';
import { useDashboardComponentsContext } from './Context';
import { HtmlTree } from './HtmlTree';
import type { THtmlComponent } from './types';

export function CreateNewComponentDrawerOpenButton() {
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
            <input name="new-component-section-toggle" type="radio" />
            <div className="text-xl collapse-title">{title}</div>
            <div {...contentProps} className={twMerge('collapse-content', contentProps?.className)}>
                {children}
                <div className="min-h-7 aesthetic-filling" />
            </div>
        </section>
    );
}

function SeoSection() {
    const [showSeoNotice, toggleSeoNotice] = useToggle(true);
    return (
        <Section title="Search Engine Optimization (SEO)" contentProps={{ className: 'flex flex-col gap-2' }}>
            {showSeoNotice && (
                <div className="w-full shadow-lg alert">
                    <AwesomeIcon icon="bell" className="alert-icon" />
                    <div className="prose">
                        <p className="text-xs">
                            <b>SEO</b> <i>title</i> and <i>description</i> are used by search engines to display your
                            component in search results.
                            <br />
                            <br />
                            By <b>default</b> these will end-up being the same as the component's <i>name</i> and{' '}
                            <i>description</i>.
                        </p>
                    </div>
                    <button className="btn btn-sm" onClick={toggleSeoNotice}>
                        OK
                    </button>
                </div>
            )}
            <SeoNameField.FormField />
            <SeoDescriptionField.FormField />
        </Section>
    );
}

function PostFormSubmissionMessages() {
    const { result, status } = useDashboardComponentsContext().apiData.createNewComponent;
    return <></>;
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
            <button
                data-tip="Close (backdrop)"
                onClick={closeDrawer}
                className="absolute left-0 right-0 w-full h-full cursor-default bg-slate-700/70"
            />
            <main className="absolute right-0 w-2/3 h-full p-4 overflow-auto rounded-l bg-base-100">
                {isCreateNewDrawerOpen && (
                    <CreateNewComponentForm className="flex flex-col gap-2" onSuccessfulSubmit={closeDrawer}>
                        <Section title="Name* and description" contentProps={{ className: 'flex flex-col gap-2' }}>
                            <NameField.FormField name="name" label="Name*" registerOptions={{ required: true }} />
                            <DescriptionField.FormField name="description" />
                        </Section>
                        <SeoSection />
                        <Section title="HTML*">
                            <ComponentHtmlField.FormField />
                        </Section>
                        {/* <Section title="Categories">
                            <div className="h-96 filler-div" />
                        </Section>
                        <Section title="Tags">
                            <div className="h-96 filler-div" />
                        </Section> */}
                        <div className="flex-1" />
                        <PostFormSubmissionMessages />
                        <div className="flex-1" />
                        <section className="flex gap-4">
                            <div className="flex-1" />
                            <CreateNewComponentForm.SubmitButton className="btn btn-accent">
                                Create
                            </CreateNewComponentForm.SubmitButton>
                        </section>
                    </CreateNewComponentForm>
                )}
            </main>
        </aside>
    );
}
