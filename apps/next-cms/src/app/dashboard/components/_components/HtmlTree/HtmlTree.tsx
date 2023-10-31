'use client';

import { useState } from 'react';
import clsx from 'clsx';

import { AwesomeIcon, TextArea, TextInput } from '~/components';
import { DaisyUiTreeNode } from './DaisyUiTreeNode';
import { HtmlTreeUtils } from './utils';
import { type TBaseProps, isSingleStringHtml, isEmptyComponent } from './types';
import { useTrackEntityProp } from './hooks';

const COMMON_BTN_CLASSES =
    'opacity-20 btn btn-xs btn-ghost hover:opacity-100 active:opacity-100 focus:opacity-100 transition-opacity';
const COMMON_INPUT_CLASSES = 'w-96 placeholder:italic placeholder:font-light';

function TreeButton({
    icon,
    tooltip,
    onClick,
}: {
    icon: React.ComponentProps<typeof AwesomeIcon>['icon'];
    tooltip?: string;
    onClick?: () => void;
}) {
    return (
        <div className="tooltip" data-tip={tooltip}>
            <button type="button" className={COMMON_BTN_CLASSES} onClick={onClick}>
                <AwesomeIcon icon={icon} />
            </button>
        </div>
    );
}

function LonelyHtmlTreeNode(props: {
    helloWorld: () => void;
    deleteSelf?: () => void;
    trackedComponent: ReturnType<typeof useTrackEntityProp>;
    trackedHtml: ReturnType<typeof useTrackEntityProp>;
}) {
    const {
        isValid: [isValidComponent, whyInvalidComponent],
        value: [component, setComponent],
    } = props.trackedComponent;

    const {
        isValid: [isValidHtml, whyInvalidHtml],
        value: [html, setHtml],
    } = props.trackedHtml;

    const [editComponentInTitle, setEditComponentInTitle] = useState(!html);
    const [useTextArea, setUseTextArea] = useState(false);

    const EditHtmlComponent = !useTextArea || editComponentInTitle ? TextInput : TextArea;
    const UserInputComponent = editComponentInTitle ? TextInput : EditHtmlComponent;

    return (
        <div className="menu">
            <div className="flex items-start gap-2">
                <label className={clsx(COMMON_BTN_CLASSES, 'swap swap-flip')}>
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        checked={editComponentInTitle}
                        onChange={(event) => setEditComponentInTitle(event.currentTarget.checked)}
                    />

                    <div className="swap-on tooltip" data-tip="HTML (text)">
                        <AwesomeIcon icon="feather" />
                    </div>
                    <div className="swap-off tooltip" data-tip="HTML Tag">
                        <AwesomeIcon icon="box" />
                    </div>
                </label>
                <div className="relative">
                    <UserInputComponent
                        {...(HtmlTreeUtils.getInputProps({
                            isValid: !editComponentInTitle ? isValidHtml : isValidComponent,
                            message: !editComponentInTitle ? whyInvalidHtml : whyInvalidComponent,
                            placeholder: !editComponentInTitle ? 'Hello world' : 'div, p, span, etc.',
                            value: !editComponentInTitle ? html : component,
                            setValue: !editComponentInTitle ? setHtml : setComponent,
                            className: clsx(COMMON_INPUT_CLASSES, editComponentInTitle ? 'font-bold' : 'font-lighter'),
                        }) as any)}
                    />
                    {!editComponentInTitle && (
                        <div className="absolute top-0 right-0">
                            <TreeButton
                                icon="up-right-and-down-left-from-center"
                                tooltip={useTextArea ? 'Use text input' : 'Use textarea'}
                                onClick={() => setUseTextArea((isUsingATextArea) => !isUsingATextArea)}
                            />
                        </div>
                    )}
                </div>
                <div className="space-x-2">
                    {!editComponentInTitle && (
                        <TreeButton icon="plus" tooltip="Hello world" onClick={props.helloWorld} />
                    )}
                    {editComponentInTitle && !!html && <TreeButton icon="info" tooltip={html} />}
                    {props.deleteSelf && <TreeButton icon="trash" tooltip="Delete" onClick={props.deleteSelf} />}
                </div>
            </div>
        </div>
    );
}

export function HtmlTree({
    open = true,
    isRoot,
    entity,
    updateEntity,
    deleteSelf,
}: { open?: boolean; isRoot?: boolean; deleteSelf?: () => void } & TBaseProps) {
    const {
        isValid: [isValidComponent, whyInvalidComponent],
        value: [component, setComponent],
    } = useTrackEntityProp({ entity, prop: 'component', updateEntity });

    const {
        isValid: [isValidHtml, whyInvalidHtml],
        value: [html, setHtml],
    } = useTrackEntityProp({ entity, prop: 'html', updateEntity });

    const updateChildEntity =
        (index = 0): TBaseProps['updateEntity'] =>
        (updates) => {
            updateEntity({
                html: HtmlTreeUtils.updateChild({ entity, index, updates }),
            });
        };

    const helloWorld = () =>
        updateEntity({
            html: [...entity.html, 'Hello world!'],
        });

    const helloWorldFromLonelyTreeNode = () =>
        updateEntity({
            html: [HtmlTreeUtils.wrapIfText(''), 'Hello world!'],
        });

    if (isSingleStringHtml(entity) || isEmptyComponent(entity)) {
        return (
            <LonelyHtmlTreeNode
                deleteSelf={deleteSelf}
                helloWorld={helloWorldFromLonelyTreeNode}
                trackedComponent={{
                    isValid: [isValidComponent, whyInvalidComponent],
                    value: [component, setComponent],
                }}
                trackedHtml={{
                    isValid: [isValidHtml, whyInvalidHtml],
                    value: [html, setHtml],
                }}
            />
        );
    }

    return (
        <DaisyUiTreeNode
            open={open}
            isRoot={isRoot}
            title={
                <>
                    <TextInput
                        {...HtmlTreeUtils.getInputProps({
                            isValid: isValidComponent,
                            message: whyInvalidComponent,
                            placeholder: 'div, p, span, etc.',
                            value: component,
                            setValue: setComponent,
                            className: clsx(COMMON_INPUT_CLASSES, 'font-bold'),
                        })}
                    />
                    <div className="space-x-2">
                        <TreeButton icon="plus" tooltip="Hello world" onClick={helloWorld} />
                        {deleteSelf && <TreeButton icon="trash" tooltip="Delete" onClick={deleteSelf} />}
                    </div>
                </>
            }
        >
            {entity.html.map((htmlChild, index) => (
                <HtmlTree
                    key={index}
                    entity={HtmlTreeUtils.wrapIfText(htmlChild)}
                    updateEntity={updateChildEntity(index)}
                    deleteSelf={() => updateEntity({ html: entity.html.filter((_, i) => i !== index) })}
                />
            ))}
        </DaisyUiTreeNode>
    );
}
