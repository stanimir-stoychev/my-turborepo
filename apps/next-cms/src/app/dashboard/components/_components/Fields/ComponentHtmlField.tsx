'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'react-use';
import { useFormContext } from 'react-hook-form';

import { noop } from '~/utils/static';

import { HtmlTree } from '../HtmlTree';
import { HtmlTreeUtils } from '../HtmlTree/utils';
import type { THtmlComponent } from '../types';

export function ComponentHtmlField({
    name = 'component-html-',
    value,
    setValue,
}: {
    name?: string;
    value: THtmlComponent;
    setValue: (value: Partial<THtmlComponent>) => void;
}) {
    const [htmlProps, setHtmlProps] = useState('');
    const [html, setHtml] = useState('');

    const prevHtmlProps = usePrevious(value.htmlProps);
    const prevHtml = usePrevious(value.html);

    useEffect(() => {
        if (prevHtmlProps !== value.htmlProps) setHtmlProps(JSON.stringify(value.htmlProps));
        if (prevHtml !== value.html) setHtml(JSON.stringify(value.html));
    }, [prevHtmlProps, prevHtml, value.htmlProps, value.html]);

    const updateEntity = (updates: Partial<THtmlComponent>) => {
        const stringifiedEntity = HtmlTreeUtils.stringifyEntity({ html: [], ...updates });

        if (updates.html) setHtml(stringifiedEntity.html);
        if (updates.htmlProps) setHtmlProps(stringifiedEntity.htmlProps ?? '');
        setValue(updates);
    };

    return (
        <>
            <input name={`${name}props`} type="text" aria-hidden className="hidden" value={htmlProps} onChange={noop} />
            <input name={`${name}html`} type="text" aria-hidden className="hidden" value={html} onChange={noop} />
            <HtmlTree isRoot entity={value} updateEntity={updateEntity} />
        </>
    );
}

ComponentHtmlField.FormField = (props: Omit<React.ComponentProps<typeof ComponentHtmlField>, 'value' | 'setValue'>) => {
    const { setValue, watch } = useFormContext<Partial<THtmlComponent>>();
    const htmlProps = watch('htmlProps');
    const html = watch('html');

    const entity = useMemo(
        () => ({
            htmlProps,
            html: html ?? [],
        }),
        [htmlProps, html],
    );

    return (
        <ComponentHtmlField
            {...props}
            value={entity}
            setValue={(updates) => {
                if (updates.htmlProps) {
                    setValue('htmlProps', updates.htmlProps);
                }

                if (updates.html) {
                    setValue('html', updates.html);
                }
            }}
        />
    );
};
