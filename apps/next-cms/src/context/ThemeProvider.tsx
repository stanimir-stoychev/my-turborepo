import { createContext, useEffect } from 'react';
import { useLocalStorage, useMedia, usePrevious } from 'react-use';

type TThemeContext = {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    removeTheme: () => void;
};

const ThemeContext = createContext<TThemeContext>({
    theme: 'light',
    setTheme: () => undefined,
    removeTheme: () => undefined,
});

export function ThemeProvider({ children }: React.PropsWithChildren) {
    const userPrefersDarkTheme = useMedia('(prefers-color-scheme: dark)', false);
    const [themeValue, setThemeValue, removeThemeValue] = useLocalStorage<TThemeContext['theme']>(
        'theme',
        userPrefersDarkTheme ? 'dark' : 'light',
    );

    const userUsedToPreferDarkTheme = usePrevious(userPrefersDarkTheme);

    useEffect(() => {
        if (themeValue !== 'dark' && themeValue !== 'light') {
            setThemeValue(userPrefersDarkTheme ? 'dark' : 'light');
        }
    }, [setThemeValue, themeValue, userPrefersDarkTheme]);

    useEffect(() => {
        if (userPrefersDarkTheme !== userUsedToPreferDarkTheme) {
            setThemeValue(userPrefersDarkTheme ? 'dark' : 'light');
        }
    }, [userPrefersDarkTheme, userUsedToPreferDarkTheme]);

    useEffect(() => {
        if (themeValue === 'dark') {
            if (!document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.add('dark');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [themeValue]);

    return (
        <ThemeContext.Provider
            value={{
                theme: themeValue ?? 'light',
                setTheme: setThemeValue,
                removeTheme: removeThemeValue,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function withThemeProvider(Component: React.ComponentType) {
    return function WithThemeProvider() {
        return (
            <ThemeProvider>
                <Component />
            </ThemeProvider>
        );
    };
}
