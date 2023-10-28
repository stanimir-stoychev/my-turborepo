import clsx from 'clsx';

export function DashboardTitle({
    className,
    ...rest
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
    return <h1 className={clsx('text-4xl', className)} {...rest} />;
}
