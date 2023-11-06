/**
 * For the time being, this file is just a proxy to the repositories...
 */

import { ComponentsRepository } from './repositories';
import type { TPrettify } from '~/types';
import type { TComponentEntity } from './entities';
import type { TComponentsRepository as TComponentsService } from './repositories';

type THtmlComponent = Pick<TComponentEntity, 'html' | 'htmlProps'>;
type TEmptyComponentEntity = TPrettify<
    Omit<THtmlComponent, 'html' | 'htmlProps'> & {
        html: [];
        htmlProps?: TPrettify<
            Omit<NonNullable<THtmlComponent['htmlProps']>, 'component'> & {
                component: undefined;
            }
        >;
    }
>;

type TStringAsComponentEntity = TPrettify<
    Omit<THtmlComponent, 'html'> & {
        html: [string];
    }
>;

const isEmptyComponent = (componentEntity: THtmlComponent): componentEntity is TEmptyComponentEntity =>
    componentEntity.html.length === 0 && !componentEntity.htmlProps?.component;

const isSingleStringHtml = (componentEntity: THtmlComponent): componentEntity is TStringAsComponentEntity =>
    typeof componentEntity.html[0] === 'string' &&
    componentEntity.html.length === 1 &&
    !componentEntity.htmlProps?.component;

const unwrapIfText = (htmlEntity: THtmlComponent): THtmlComponent['html'][number] => {
    if (isSingleStringHtml(htmlEntity)) {
        return htmlEntity.html[0];
    }

    return htmlEntity;
};

const sanitizeHtmlProps = (htmlProps: THtmlComponent['htmlProps']): THtmlComponent['htmlProps'] => {
    if (!htmlProps) return undefined;
    return Object.entries(htmlProps).reduce(
        (acc, [key, value]) => {
            if (value) {
                acc[key as keyof typeof acc] = value;
            }

            return acc;
        },
        {} as NonNullable<THtmlComponent['htmlProps']>,
    );
};

const sanitizeHtml = (html: THtmlComponent['html']): THtmlComponent['html'] => {
    return html.reduce(
        (acc, rawChild) => {
            let child: typeof rawChild | null = null;

            if (typeof rawChild === 'string') {
                child = rawChild;
            } else if (!isEmptyComponent(rawChild)) {
                child = unwrapIfText(rawChild);
            }

            if (child) {
                if (typeof child !== 'string') {
                    child.html = sanitizeHtml(child.html);
                    if (child.htmlProps) {
                        child.htmlProps = sanitizeHtmlProps(child.htmlProps);
                    }
                }

                acc.push(child);
            }

            return acc;
        },
        [] as THtmlComponent['html'],
    );
};

export type { TComponentsService };
export const ComponentsService: TComponentsService = {
    ...ComponentsRepository,
    create: (...[component]: Parameters<TComponentsService['create']>): ReturnType<TComponentsService['create']> => {
        return ComponentsRepository.create({
            ...component,
            html: sanitizeHtml(component.html),
            htmlProps: sanitizeHtmlProps(component.htmlProps),
        });
    },
};
