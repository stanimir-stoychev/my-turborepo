import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import clsx from 'clsx';
import { AwesomeIcon } from '~/components';

const supportedThemes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
] as const;

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

export const useTheme = () => useContext(Context);

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

ThemeProvider.ThemeToggle = function ThemeToggle({
    alignToEnd = false,
    position = 'bottom',
}: {
    alignToEnd?: boolean;
    position?: 'left' | 'right' | 'top' | 'bottom';
}) {
    const { setTheme, theme: currentTheme } = useTheme();

    return (
        <div
            className={clsx('dropdown', {
                'dropdown-end': alignToEnd,
                'dropdown-left': position === 'left',
                'dropdown-right': position === 'right',
                'dropdown-top': position === 'top',
                'dropdown-bottom': position === 'bottom',
            })}
        >
            <label tabIndex={0} className="btn btn-xs btn-ghost">
                <AwesomeIcon icon="fill-drip" />
            </label>
            <aside className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[70vh] max-h-96 w-56 overflow-y-auto shadow mt-16 z-20">
                <div className="grid grid-cols-1 gap-3 p-3">
                    {supportedThemes.map((theme) => (
                        <button
                            className="overflow-hidden text-left rounded-lg outline-base-content"
                            onClick={() => setTheme(theme)}
                            data-theme={theme}
                        >
                            <div
                                className="w-full font-sans cursor-pointer bg-base-100 text-base-content"
                                data-theme={theme}
                            >
                                <div className="grid grid-cols-5 grid-rows-3">
                                    <div className="flex items-center col-span-5 row-span-3 row-start-1 gap-2 px-4 py-3">
                                        <AwesomeIcon
                                            icon="fill-drip"
                                            className={theme === currentTheme ? 'text-bg-base-100' : 'opacity-0'}
                                        />
                                        <div className="flex-grow text-sm">{theme}</div>
                                        <div className="flex flex-wrap flex-shrink-0 h-full gap-1">
                                            <div className="w-2 rounded bg-primary"></div>
                                            <div className="w-2 rounded bg-secondary"></div>
                                            <div className="w-2 rounded bg-accent"></div>
                                            <div className="w-2 rounded bg-neutral"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>
        </div>
    );
};
