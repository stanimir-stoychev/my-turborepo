import { TPrettify } from '~/types';
import type { THtmlComponent } from '../types';

export type TEmptyComponentEntity = TPrettify<
    Omit<THtmlComponent, 'html' | 'htmlProps'> & {
        html: [];
        htmlProps?: TPrettify<
            Omit<NonNullable<THtmlComponent['htmlProps']>, 'component'> & {
                component: undefined;
            }
        >;
    }
>;

export type TStringAsComponentEntity = TPrettify<
    Omit<THtmlComponent, 'html'> & {
        html: [string];
    }
>;

export const isEmptyComponent = (componentEntity: THtmlComponent): componentEntity is TEmptyComponentEntity =>
    componentEntity.html.length === 0 && !componentEntity.htmlProps?.component;

export const isSingleStringHtml = (componentEntity: THtmlComponent): componentEntity is TStringAsComponentEntity =>
    typeof componentEntity.html[0] === 'string' &&
    componentEntity.html.length === 1 &&
    !componentEntity.htmlProps?.component;

export type TBaseProps = {
    entity: THtmlComponent;
    updateEntity: (updatedEntity: Partial<THtmlComponent>) => void;
};
