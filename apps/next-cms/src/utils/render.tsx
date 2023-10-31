import { Fragment } from 'react';
import { UiBox } from '~/components';
import type { THtmlBlockProps } from '~/types';

export function renderHtmlBlock({ children, ...rest }: THtmlBlockProps) {
    if (Array.isArray(children)) {
        return (
            <UiBox component={Fragment} {...rest}>
                {children.map((block, index) => (
                    <Fragment key={index}>{renderHtmlBlock(block)}</Fragment>
                ))}
            </UiBox>
        );
    }

    return (
        <UiBox component={Fragment} {...rest}>
            {typeof children === 'object' ? renderHtmlBlock(children) : children}
        </UiBox>
    );
}

export const HtmlBlock: React.FC<THtmlBlockProps> = (props) => renderHtmlBlock(props);
