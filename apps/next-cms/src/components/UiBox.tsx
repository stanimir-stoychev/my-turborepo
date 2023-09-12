import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';

export type UiBoxComponent<ComponentProps = HTMLElement> =
    | keyof JSX.IntrinsicElements
    | React.ComponentType<ComponentProps>;

export interface UiBoxProps<ComponentProps = HTMLElement>
    extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<ComponentProps>, ComponentProps>, 'className'> {
    component?: UiBoxComponent<ComponentProps>;
    className?: ClassValue;
    children?: React.ReactNode;
}

export const UiBox = forwardRef<HTMLElement, UiBoxProps>(function UiBox(
    { className, component = 'div', ...rest },
    ref,
) {
    const Root: React.ElementType = component;
    const props = {
        ...(className && { className: clsx(className) }),
        ...rest,
    };

    return <Root ref={ref} {...props} />;
});
