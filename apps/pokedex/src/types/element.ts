import { ClassValue } from 'clsx';

export type TBaseElement<TElement extends Element = Element> = React.DetailedHTMLProps<
    React.HTMLAttributes<TElement>,
    TElement
>;

export type TElementWithAs<TElement extends Element = Element, TProps = undefined> = TBaseElement<TElement> & {
    as: keyof JSX.IntrinsicElements | React.ComponentType<TProps>;
} & TProps extends Record<string, unknown>
    ? TProps
    : {};

export type TElementWithClassName<TElement extends Element = Element> = TBaseElement<TElement> & {
    className?: ClassValue;
};
