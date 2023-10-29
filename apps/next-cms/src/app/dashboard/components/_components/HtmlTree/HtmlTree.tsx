'use client';

import { useToggle } from 'react-use';

import { AwesomeIcon, TextInput } from '~/components';
import { DaisyUiTreeNode } from './DaisyUiTreeNode';
import { HtmlTreeUtils } from './utils';
import { type TBaseProps, isSingleStringHtml, isEmptyComponent } from './types';
import { useTrackEntityProp } from './hooks';
import { useState } from 'react';

function HtmlTreeNodeText(props: ReturnType<typeof useTrackEntityProp>) {
    const {
        isValid: [isValid, whyInvalid],
        value: [value, setValue],
    } = props;

    const [isEditing, toggleIsEditing] = useToggle(false);

    return (
        <div className="flex justify-between gap-1">
            {!isEditing ? (
                value ? (
                    value
                ) : (
                    <span className="italic text-gray-400">Empty</span>
                )
            ) : (
                <TextInput
                    {...HtmlTreeUtils.getInputProps({
                        isValid,
                        message: whyInvalid,
                        value,
                        setValue,
                    })}
                />
            )}
            <label className="swap swap-flip">
                {/* this hidden checkbox controls the state */}
                <input disabled={!isValid} type="checkbox" onChange={toggleIsEditing} />

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

function LonelyHtmlTreeNode(props: {
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
                <label className="swap swap-flip">
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
                    })}
                />
            </div>
        </div>
    );
}

export function HtmlTree({ isRoot, entity, updateEntity }: { isRoot?: boolean } & TBaseProps) {
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

    if (isSingleStringHtml(entity) || isEmptyComponent(entity)) {
        return (
            <LonelyHtmlTreeNode
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
                <TextInput
                    {...HtmlTreeUtils.getInputProps({
                        isValid: isValidComponent,
                        message: whyInvalidComponent,
                        placeholder: 'div, p, span, etc.',
                        value: component,
                        setValue: setComponent,
                    })}
                />
            }
        >
            {entity.html.map((htmlChild, index) => (
                <HtmlTree
                    key={index}
                    entity={HtmlTreeUtils.wrapIfText(htmlChild)}
                    updateEntity={updateChildEntity(index)}
                />
            ))}
        </DaisyUiTreeNode>
    );
}
