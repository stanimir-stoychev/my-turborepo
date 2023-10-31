'use client';

import { useState } from 'react';

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

export function DaisyUiTreeNode(props: {
    children: React.ReactNode[];
    title: React.ReactNode;
    isRoot?: boolean;
    open?: boolean;
}) {
    const { title, children, isRoot } = props;
    const [isOpen, toggleIsOpen] = useState(props.open);

    return (
        <Wrapper isRoot={isRoot}>
            <details className="my-1" open={isOpen} onChange={(event) => toggleIsOpen(event.currentTarget.open)}>
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
