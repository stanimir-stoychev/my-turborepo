'use client';

import { Fragment, useState } from 'react';
import { useToggle } from 'react-use';

import { AwesomeIcon, TextArea, TextInput } from '~/components';
import type { THtmlComponent } from './types';

type TStringAsComponentEntity = THtmlComponent & { html: [string] };
const isSingleStringHtml = (componentEntity: THtmlComponent): componentEntity is TStringAsComponentEntity =>
    typeof componentEntity.html[0] === 'string' &&
    componentEntity.html.length === 1 &&
    !componentEntity.htmlProps?.component;

function HtmlTreeWrapper({ children, isRoot }: React.PropsWithChildren<{ isRoot?: boolean }>) {
    if (!isRoot) {
        return <Fragment>{children}</Fragment>;
    }

    return (
        <ul className="menu menu-xs">
            <li>{children}</li>
        </ul>
    );
}

function HtmlTreeNodeTemplate(props: {
    children: (isOpen: boolean) => React.ReactNode[];
    title: (isOpen: boolean) => React.ReactNode;
    isRoot?: boolean;
}) {
    const { title, children, isRoot } = props;
    const [isOpen, setIsOpen] = useState(true);
    return (
        <HtmlTreeWrapper isRoot={isRoot}>
            <details open onToggle={(event) => setIsOpen(event.currentTarget.open)}>
                <summary>{title(isOpen)}</summary>
                <ul>
                    {children(isOpen).map((child, index) => (
                        <li key={index}>{child}</li>
                    ))}
                </ul>
            </details>
        </HtmlTreeWrapper>
    );
}

function HtmlTreeNodeText(props: {
    entity: TStringAsComponentEntity;
    updateEntity: (componentEntity: Partial<THtmlComponent>) => void;
}) {
    const { entity, updateEntity } = props;
    const [isEditing, toggleIsEditing] = useToggle(false);
    const [text, setText] = useState(entity.html[0]);

    return (
        <div className="flex justify-between gap-1">
            {!isEditing ? (
                entity.html[0]
            ) : (
                <TextArea value={text} onChange={(event) => setText(event.currentTarget.value)} />
            )}
            <label className="swap swap-flip">
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" onChange={toggleIsEditing} />

                <div className="swap-on tooltip" data-tip="Save">
                    <AwesomeIcon icon="check" />
                </div>
                <div className="swap-off tooltip" data-tip="Edit">
                    <AwesomeIcon icon="pen" />
                </div>
            </label>
        </div>
    );
}

export function HtmlTree(props: {
    isRoot?: boolean;
    entity: THtmlComponent;
    updateEntity: (componentEntity: Partial<THtmlComponent>) => void;
}) {
    const { isRoot, entity } = props;

    if (isSingleStringHtml(entity)) {
        return (
            <HtmlTreeNodeTemplate
                title={(isOpen) => entity.html[0]}
                children={() => [<HtmlTreeNodeText entity={entity} updateEntity={console.log} />]}
            />
        );
    }

    return (
        <HtmlTreeNodeTemplate
            isRoot={isRoot}
            title={() => entity.htmlProps?.component || '<>'}
            children={() =>
                entity.html.map((htmlChild, index) => (
                    <HtmlTree
                        key={index}
                        entity={typeof htmlChild === 'string' ? { html: [htmlChild] } : htmlChild}
                        updateEntity={console.log}
                    />
                ))
            }
        />
    );
}
