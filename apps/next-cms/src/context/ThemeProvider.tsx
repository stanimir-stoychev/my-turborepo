import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

const supportedThemes = ['light', 'dark', 'forest', 'aqua', 'winter'] as const;

type TThemeContext = {
    theme: (typeof supportedThemes)[number];
    setTheme: (theme: TThemeContext['theme']) => void;
    removeTheme: () => void;
};

const DEFAULT_CONTEXT: TThemeContext = {
    theme: 'forest',
    setTheme: () => undefined,
    removeTheme: () => undefined,
};

const Context = createContext(DEFAULT_CONTEXT);
Context.displayName = '(daisyui) Theme Context';

export function ThemeProvider({ children }: React.PropsWithChildren) {
    const [theme = DEFAULT_CONTEXT.theme, setThemeInLocalStorage, removeTheme] = useLocalStorage(
        'theme',
        DEFAULT_CONTEXT.theme,
    );

    const setTheme = useCallback(
        (newTheme = DEFAULT_CONTEXT.theme) => {
            const nextTheme = supportedThemes.includes(newTheme) ? newTheme : DEFAULT_CONTEXT.theme;
            setThemeInLocalStorage(nextTheme);
        },
        [setThemeInLocalStorage],
    );

    const context = useMemo(
        (): typeof DEFAULT_CONTEXT => ({
            theme,
            setTheme,
            removeTheme,
        }),
        [theme, setTheme, removeTheme],
    );

    useEffect(() => {
        if (document.documentElement.dataset.theme !== theme) {
            document.documentElement.dataset.theme = theme;
        }
    }, [theme]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function withThemeProvider<P>(Component: React.ComponentType<P>) {
    return function WithThemeProvider(props: P & JSX.IntrinsicAttributes) {
        return (
            <ThemeProvider>
                <Component {...props} />
            </ThemeProvider>
        );
    };
}
