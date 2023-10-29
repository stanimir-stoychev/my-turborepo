function Wrapper({ children, isRoot }: React.PropsWithChildren<{ isRoot?: boolean }>) {
    if (!isRoot) {
        return <>{children}</>;
    }

    return (
        <ul className="menu menu-xs">
            <li>{children}</li>
        </ul>
    );
}

export function DaisyUiTreeNode(props: { children: React.ReactNode[]; title: React.ReactNode; isRoot?: boolean }) {
    const { title, children, isRoot } = props;

    return (
        <Wrapper isRoot={isRoot}>
            <details>
                <summary>{title}</summary>
                <ul>
                    {children.map((child, index) => (
                        <li key={index}>{child}</li>
                    ))}
                </ul>
            </details>
        </Wrapper>
    );
}
