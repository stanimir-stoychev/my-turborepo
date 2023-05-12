import { useState, useCallback, useEffect } from 'react';

export const useIntersection = (options: IntersectionObserverInit) => {
    const [intersection, setIntersection] = useState<IntersectionObserverEntry | null>(null);
    const [element, setElement] = useState<HTMLElement | null>(null);

    const captureIntersectionElement = useCallback((element: HTMLElement | null) => {
        element && setElement(element);
    }, []);

    useEffect(() => {
        if (element == null || typeof IntersectionObserver !== 'function') return;

        const observer = new IntersectionObserver((entries) => setIntersection(entries[0]), options);
        observer.observe(element);

        return () => {
            setIntersection(null);
            observer.disconnect();
        };
    }, [options, element]);

    return {
        captureIntersectionElement,
        element,
        intersection,
    };
};
