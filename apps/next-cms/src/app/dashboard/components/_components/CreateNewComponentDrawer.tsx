'use client';

import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useKey, useToggle } from 'react-use';

import { AwesomeIcon } from '~/components';

import { usePageView } from './PageView';
import { CreateNewComponentForm } from './Forms';
import { ComponentHtmlField, DescriptionField, NameField, SeoDescriptionField, SeoNameField } from './Fields';
import { Drawer } from './Drawer';

export function CreateNewComponentDrawerOpenButton() {
    const { createNewComponent, viewActions } = usePageView();
    return (
        <div className="tooltip tooltip-left" data-tip="Create new component">
            <button
                aria-label="Create new component"
                disabled={createNewComponent}
                className="btn btn-accent"
                onClick={() => viewActions.setCreateNewComponent(true)}
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

export function CreateNewComponentDrawer() {
    const { createNewComponent, viewActions } = usePageView();

    const isDrawerOpen = !!createNewComponent;
    const closeDrawer = useCallback(
        () => viewActions.setCreateNewComponent(false),
        [viewActions.setCreateNewComponent],
    );

    useKey('Escape', closeDrawer, { event: 'keydown' });

    return (
        <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
            {isDrawerOpen && (
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
                    <section className="flex gap-4">
                        <div className="flex-1" />
                        <CreateNewComponentForm.SubmitButton className="btn btn-accent">
                            Create
                        </CreateNewComponentForm.SubmitButton>
                    </section>
                </CreateNewComponentForm>
            )}
        </Drawer>
    );
}
