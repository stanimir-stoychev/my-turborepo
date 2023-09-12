import { forwardRef } from 'react';

export type TUiBoxProps<E extends HTMLElement = HTMLElement, CP = undefined> = {
    component?: keyof JSX.IntrinsicElements | React.ComponentType<CP>;
} & (CP extends undefined ? React.HtmlHTMLAttributes<E> : CP);

function UiBoxInner<E extends HTMLElement, CP = React.HtmlHTMLAttributes<E>>(
    { component = 'div', ...rest }: TUiBoxProps<E, CP>,
    ref: React.ForwardedRef<E>,
) {
    const Root: React.ElementType = component;
    return <Root ref={ref} {...rest} />;
}

export const UiBox = forwardRef(UiBoxInner) as <E extends HTMLElement, CP = React.HtmlHTMLAttributes<E>>(
    props: TUiBoxProps<E, CP> & { ref?: React.ForwardedRef<E> },
) => ReturnType<typeof UiBoxInner<E, CP>>;
