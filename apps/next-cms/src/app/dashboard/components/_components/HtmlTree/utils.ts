import { SUPPORTED_HTML_TAGS } from './constants';
import { isEmptyComponent, isSingleStringHtml } from './types';
import type { TextInput } from '~/components';
import type { THtmlComponent } from '../types';

export const HtmlTreeUtils = {
    wrapIfText: (htmlEntity: THtmlComponent['html'][number]): THtmlComponent => {
        if (typeof htmlEntity === 'string') {
            return { html: [htmlEntity] };
        }

        return htmlEntity;
    },

    isValidComponent: (component?: string): boolean => {
        if (!component) return true;
        return SUPPORTED_HTML_TAGS.includes(component as any);
    },

    isValidHtml: (html?: string): boolean => {
        return !!html?.length;
    },

    getInputProps: ({
        isValid,
        setValue,
        inputSize = 'xs',
        ...rest
    }: Partial<React.ComponentProps<typeof TextInput>> & {
        isValid: boolean;
        setValue: (value: string) => void;
    }): React.ComponentProps<typeof TextInput> => ({
        ...rest,
        inputSize,
        color: isValid ? undefined : 'error',
        onChange: (e) => setValue(e.target.value),
    }),

    /**
     * Updates an entity's child at a given index.
     * The update will be shallow, meaning that only the properties passed in the `updates` object will be updated.
     * The results will be expressed in new objects, so the original entity will not be mutated.
     */
    updateChild: ({
        entity,
        index,
        updates,
    }: {
        entity: THtmlComponent;
        index: number;
        updates: Partial<THtmlComponent>;
    }) =>
        entity.html.map((htmlChild, htmlChildIndex) => {
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

    stringifyEntity: (entity: THtmlComponent) => {
        return {
            htmlProps: entity.htmlProps && JSON.stringify(entity.htmlProps),
            html: JSON.stringify(
                entity.html.map((child) => {
                    if (typeof child === 'string') return child;
                    if (isSingleStringHtml(child)) return child.html[0];
                    if (isEmptyComponent(child)) return undefined;
                    return child;
                }),
            ),
        };
    },
} as const;
