import { Fragment, forwardRef } from 'react';

export type TUiBoxProps<E extends HTMLElement = HTMLElement, CP = undefined> = {
    component?: keyof JSX.IntrinsicElements | React.ComponentType<CP>;
    children?: React.ReactNode;
} & (CP extends undefined ? React.HtmlHTMLAttributes<E> : CP);

function UiBoxInner<E extends HTMLElement, CP = React.HtmlHTMLAttributes<E>>(
    { component = 'div', ...rest }: TUiBoxProps<E, CP>,
    ref: React.ForwardedRef<E>,
) {
    const Root: React.ElementType = component;
    const componentProps = Root === Fragment ? { children: rest.children } : rest;
    return <Root ref={ref} {...componentProps} />;
}

export const UiBox = forwardRef(UiBoxInner) as <E extends HTMLElement, CP = React.HtmlHTMLAttributes<E>>(
    props: TUiBoxProps<E, CP> & { ref?: React.ForwardedRef<E> },
) => ReturnType<typeof UiBoxInner<E, CP>>;
