import { AppDrawer, AppDrawerToggle, AppFooter, AppNavbar } from './components';
import { APP_DRAWER_CONTENT_ID, APP_DRAWER_TOGGLE_ID } from './components/constants';

import './globals.css';

export const metadata = {
    title: 'Pokedex',
    description: 'A simple pokedex app',
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
    <html lang="en">
        <body className="w-screen h-screen drawer">
            <input tabIndex={-1} id={APP_DRAWER_TOGGLE_ID} type="checkbox" className="drawer-toggle" />
            <div id={APP_DRAWER_CONTENT_ID} className="flex flex-col drawer-content">
                <AppNavbar />
                <div className="flex-1">{children}</div>
                <AppFooter />
            </div>
            <div className="drawer-side">
                <AppDrawerToggle className="drawer-overlay" />
                <aside className="p-4 w-80 bg-base-100 text-base-content">
                    <AppDrawer />
                </aside>
            </div>
        </body>
    </html>
);

export default RootLayout;
