'use client';

import { Children, useState } from 'react';

export type TTabsProps = React.PropsWithChildren<{
    className?: string;
    initialActiveIndex?: number;
    tabs: React.ReactNode[];
}>;

export const Tabs: React.FC<TTabsProps> = ({ children, className, tabs }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <div className={`justify-center tabs ${className}`}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab tab-md md:tab-lg tab-bordered ${index === activeIndex ? 'tab-active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {Children.toArray(children)[activeIndex]}
        </>
    );
};
