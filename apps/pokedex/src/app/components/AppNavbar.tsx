import NextLink from 'next/link';
import clsx, { ClassValue } from 'clsx';

import { AppDrawerToggle } from './AppDrawer';

const HamburgerIcon: React.FC<{ className?: ClassValue }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={clsx('stroke-current', className)}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const DotsIcon: React.FC<{ className?: ClassValue }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={clsx('stroke-current', className)}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
    </svg>
);

export const AppNavbar: React.FC<{ className?: ClassValue }> = ({ className }) => (
    <nav className={clsx('navbar bg-neutral text-neutral-content', className)}>
        <AppDrawerToggle className="flex-none btn btn-square btn-ghost">
            <HamburgerIcon className="inline-block w-5 h-5" />
        </AppDrawerToggle>

        <div className="flex-1">
            <NextLink href="/" className="text-xl normal-case btn btn-ghost">
                Pokedex
            </NextLink>
        </div>

        <button className="flex-none btn btn-square btn-ghost">
            <DotsIcon className="inline-block w-5 h-5" />
        </button>
    </nav>
);
