import { useState, useEffect } from 'react';
import { usePrevious, useDebounce } from 'react-use';
import { HtmlTreeUtils } from './utils';
import type { TBaseProps } from './types';

/**
 * A hook that will "track" a single prop of an entity.
 *
 * `NOTE:` At the moment this supports tracking the `component` and `html` props only!
 * `html` is actually just plain old text...
 *
 * @param props Specify the prop to track, the entity, and how to update the entity.
 * @returns A "simple" interface for editing a single prop of an entity.
 */
export const useTrackEntityProp = ({ entity, prop, updateEntity }: { prop: 'component' | 'html' } & TBaseProps) => {
    const currentEntityValue = prop === 'component' ? entity.htmlProps?.component : entity.html[0];
    const prevCurrentEntityValue = usePrevious(currentEntityValue);

    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState('');
    const [localValue, setLocalValue] = useState(typeof currentEntityValue === 'string' ? currentEntityValue : '');

    useEffect(() => {
        // Keeps local state in sync with the entity

        if (prevCurrentEntityValue === currentEntityValue) return;
        if (currentEntityValue === localValue) return;
        setLocalValue(typeof currentEntityValue === 'string' ? currentEntityValue : '');
    }, [currentEntityValue, prevCurrentEntityValue, localValue]);

    useEffect(() => {
        let isValid = false;
        let message = '';

        if (prop === 'html') {
            isValid = HtmlTreeUtils.isValidHtml(localValue);
            if (!isValid) message = '(Text) nodes must have a value!';
        } else {
            isValid = HtmlTreeUtils.isValidComponent(localValue);
            if (!isValid) message = 'Unsupported component';
        }

        setIsValid(isValid);
        setMessage(message);
    }, [localValue, prop]);

    useDebounce(
        () => {
            if (!isValid) return;
            updateEntity(
                prop === 'component'
                    ? { htmlProps: { component: localValue } }
                    : { html: localValue ? [localValue] : [] },
            );
        },
        750,
        [localValue, isValid],
    );

    return {
        isValid: [isValid, message] as const,
        value: [localValue, setLocalValue] as const,
    };
};
