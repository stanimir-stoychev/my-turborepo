'use client';

import { Fragment, useEffect, useState } from 'react';
import { useDebounce, usePrevious, useToggle } from 'react-use';

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
    children: React.ReactNode[] | ((isOpen: boolean) => React.ReactNode[]);
    title: (isOpen: boolean) => React.ReactNode;
    isRoot?: boolean;
}) {
    const { title, children, isRoot } = props;
    const [isOpen, setIsOpen] = useState(false);
    const childrenArray = typeof children === 'function' ? children(isOpen) : children;
    return (
        <HtmlTreeWrapper isRoot={isRoot}>
            <details onToggle={(event) => setIsOpen(event.currentTarget.open)}>
                <summary>{title(isOpen)}</summary>
                <ul>
                    {childrenArray.map((child, index) => (
                        <li key={index}>{child}</li>
                    ))}
                </ul>
            </details>
        </HtmlTreeWrapper>
    );
}

const SUPPORTED_HTML_TAGS = [
    'div',
    'span',
    'p',
    'aside',
    'article',
    'section',
    'header',
    'footer',
    'main',
    'nav',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
] as const;

const htmlEntityToTreeEntity = (htmlEntity: THtmlComponent['html'][number]): THtmlComponent => {
    if (typeof htmlEntity === 'string') {
        return { html: [htmlEntity] };
    }

    return htmlEntity;
};

/**
 * A hook that will "track" a single prop of an entity.
 *
 * `NOTE:` At the moment this supports tracking the `component` and `html` props only!
 *
 * @param props Specify the prop to track, the entity, and how to update the entity.
 * @returns A "simple" interface for editing a single prop of an entity.
 */
const useTrackEntityProp = (
    props: { prop: 'component' | 'html' } & Pick<React.ComponentProps<typeof HtmlTree>, 'entity' | 'updateEntity'>,
) => {
    const { entity, prop, updateEntity } = props;
    const currentEntityValue = prop === 'component' ? entity.htmlProps?.component : entity.html[0];
    const prevCurrentEntityValue = usePrevious(currentEntityValue);

    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState('');
    const [localValue, setLocalValue] = useState(
        typeof currentEntityValue === 'string' ? currentEntityValue : undefined,
    );

    useEffect(() => {
        // Keeps local state in sync with the entity

        if (prevCurrentEntityValue === currentEntityValue) return;
        if (currentEntityValue === localValue) return;
        setLocalValue(typeof currentEntityValue === 'string' ? currentEntityValue : undefined);
    }, [currentEntityValue, prevCurrentEntityValue, localValue]);

    useEffect(() => {
        let isValid = false;
        let message = '';

        if (prop === 'html') {
            isValid = !!localValue?.length;
            if (!isValid) message = '(Text) nodes must have a value!';
        } else {
            isValid = !localValue ? true : SUPPORTED_HTML_TAGS.includes(localValue as any);
            if (!isValid) message = 'Unsupported component';
        }

        setIsValid(isValid);
        setMessage(message);
    }, [localValue, prop]);

    useDebounce(
        () => {
            if (!isValid || currentEntityValue === localValue) return;
            updateEntity(
                prop === 'component'
                    ? { htmlProps: { component: localValue } }
                    : { html: localValue ? [localValue] : [] },
            );
        },
        250,
        [currentEntityValue, localValue, isValid],
    );

    return {
        isValid: [isValid, message] as const,
        value: [localValue, setLocalValue] as const,
    };
};

function EntityValueInput(props: {
    isValid: boolean;
    message: string;
    placeholder?: string;
    value: string | undefined;
    setValue: (value: string | undefined) => void;
    inputSize?: 'xs' | 'sm' | 'md' | 'lg';
    inputType: 'text' | 'textarea';
}) {
    const { isValid, message, value, setValue, inputType, inputSize, placeholder } = props;
    const TextInputComponent = inputType === 'text' ? TextInput : TextArea;
    return (
        <TextInputComponent
            inputSize={inputSize}
            color={isValid ? undefined : 'error'}
            placeholder={placeholder}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            message={message}
            className=""
        />
    );
}

function HtmlTreeNodeText(props: ReturnType<typeof useTrackEntityProp>) {
    const {
        isValid: [isValid, whyInvalid],
        value: [value, setValue],
    } = props;

    const [isEditing, toggleIsEditing] = useToggle(false);

    return (
        <div className="flex items-start justify-between gap-1">
            {!isEditing ? (
                value
            ) : (
                <EntityValueInput
                    inputType="textarea"
                    value={value}
                    setValue={setValue}
                    isValid={isValid}
                    message={whyInvalid}
                />
            )}
            <div>
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
        </div>
    );
}

export function HtmlTree(props: {
    isRoot?: boolean;
    entity: THtmlComponent;
    updateEntity: (updates: Partial<THtmlComponent>) => void;
}) {
    const { isRoot, entity, updateEntity } = props;

    const {
        isValid: [isValidComponent, whyInvalidComponent],
        value: [component, setComponent],
    } = useTrackEntityProp({ entity, prop: 'component', updateEntity });

    const {
        isValid: [isValidHtml, whyInvalidHtml],
        value: [html, setHtml],
    } = useTrackEntityProp({ entity, prop: 'html', updateEntity });

    const renderTitle = (isOpen: boolean) => {
        const valueInputProps: React.ComponentProps<typeof EntityValueInput> = {
            inputType: 'text',
            inputSize: 'xs',
            isValid: isValidComponent,
            message: whyInvalidComponent,
            placeholder: 'div, span, p, etc.',
            value: component ?? '',
            setValue: setComponent,
        };

        if (isSingleStringHtml(entity) && !isOpen) {
            valueInputProps.isValid = isValidHtml;
            valueInputProps.message = whyInvalidHtml;
            valueInputProps.placeholder = 'hello world';
            valueInputProps.value = html ?? '';
            valueInputProps.setValue = setHtml;
        }

        return <EntityValueInput {...valueInputProps} />;
    };

    const updateChildEntity =
        (index = 0) =>
        (updates: Partial<THtmlComponent>) => {
            updateEntity({
                html: entity.html.map((htmlChild, htmlChildIndex) => {
                    if (htmlChildIndex !== index) return htmlChild;

                    if (typeof htmlChild === 'string') {
                        // We had a string that we are now updating to something else
                        if (typeof updates.htmlProps?.component === 'string') {
                            // We're changing the string to a component
                            return {
                                html: [htmlChild],
                                ...updates,
                            };
                        }

                        // We're changing the string to another string
                        const [newValue] = updates.html ?? [];
                        return newValue ?? htmlChild;
                    }

                    return {
                        ...htmlChild,
                        ...updates,
                    };
                }),
            });
        };

    return (
        <HtmlTreeNodeTemplate isRoot={isRoot} title={renderTitle}>
            {() => {
                if (!isSingleStringHtml(entity))
                    return entity.html.map((htmlChild, index) => (
                        <HtmlTree
                            key={index}
                            entity={htmlEntityToTreeEntity(htmlChild)}
                            updateEntity={updateChildEntity(index)}
                        />
                    ));

                return [<HtmlTreeNodeText isValid={[isValidHtml, whyInvalidHtml]} value={[html, setHtml]} />];
            }}
        </HtmlTreeNodeTemplate>
    );
}
