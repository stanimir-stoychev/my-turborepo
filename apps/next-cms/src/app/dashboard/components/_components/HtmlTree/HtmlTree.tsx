'use client';

import { useState } from 'react';

import { AwesomeIcon, TextInput } from '~/components';
import { DaisyUiTreeNode } from './DaisyUiTreeNode';
import { HtmlTreeUtils } from './utils';
import { type TBaseProps, isSingleStringHtml, isEmptyComponent } from './types';
import { useTrackEntityProp } from './hooks';

const COMMON_BTN_CLASSES = 'opacity-20 btn btn-xs btn-ghost hover:opacity-100 focus:opacity-100 transition-opacity';

function LonelyHtmlTreeNode(props: {
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

    const [editComponentInTitle, setEditComponentInTitle] = useState(false);

    return (
        <div className="menu">
            <div className="flex items-start gap-2">
                <label className="transition-opacity swap swap-flip opacity-20 btn btn-xs btn-ghost hover:opacity-100 focus:opacity-100">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        checked={editComponentInTitle}
                        onChange={(event) => setEditComponentInTitle(event.currentTarget.checked)}
                    />

                    <div className="swap-on tooltip" data-tip="Text">
                        <AwesomeIcon icon="feather" />
                    </div>
                    <div className="swap-off tooltip" data-tip="HTML Tag">
                        <AwesomeIcon icon="box" />
                    </div>
                </label>
                <TextInput
                    {...HtmlTreeUtils.getInputProps({
                        isValid: !editComponentInTitle ? isValidHtml : isValidComponent,
                        message: !editComponentInTitle ? whyInvalidHtml : whyInvalidComponent,
                        placeholder: !editComponentInTitle ? 'Hello world' : 'div, p, span, etc.',
                        value: !editComponentInTitle ? html : component,
                        setValue: !editComponentInTitle ? setHtml : setComponent,
                        className: editComponentInTitle ? 'font-bold' : 'font-lighter',
                    })}
                />
                {props.deleteSelf && (
                    <div className="tooltip" data-tip="Delete">
                        <button type="button" className={COMMON_BTN_CLASSES} onClick={props.deleteSelf}>
                            <AwesomeIcon icon="trash" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function HtmlTree({
    isRoot,
    entity,
    updateEntity,
    deleteSelf,
}: { isRoot?: boolean; deleteSelf?: () => void } & TBaseProps) {
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
            html: [...entity.html, { html: ['Hello world!'] }],
        });

    if (isSingleStringHtml(entity) || isEmptyComponent(entity)) {
        return (
            <LonelyHtmlTreeNode
                deleteSelf={deleteSelf}
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
                            className: 'font-bold',
                        })}
                    />
                    <div className="space-x-2">
                        <div className="tooltip" data-tip="Hello world">
                            <button type="button" className={COMMON_BTN_CLASSES} onClick={helloWorld}>
                                <AwesomeIcon icon="plus" />
                            </button>
                        </div>
                        {deleteSelf && (
                            <div className="tooltip" data-tip="Delete">
                                <button type="button" className={COMMON_BTN_CLASSES} onClick={deleteSelf}>
                                    <AwesomeIcon icon="trash" />
                                </button>
                            </div>
                        )}
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
