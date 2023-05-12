import clsx, { ClassValue } from 'clsx';

export const AppFooter: React.FC<{ className?: ClassValue }> = ({ className }) => (
    <footer className={clsx('p-1 footer footer-center bg-neutral text-neutral-content', className)}>
        <p>Copyright © 2023 - All right reserved by Stanimir Stoychev</p>
    </footer>
);
