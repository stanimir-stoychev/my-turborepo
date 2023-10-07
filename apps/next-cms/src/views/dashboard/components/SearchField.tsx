import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { AwesomeIcon } from '~/components';
import { useDashboardToaster } from '~/layout/dashboard/DashboardToaster';

import { useDashboardComponentsContext } from './Context';

export function SearchField({ className, onSubmit, ...rest }: React.HtmlHTMLAttributes<HTMLFormElement>) {
    const { pushToast } = useDashboardToaster();
    const [searchTerm, setSearchTerm] = useDashboardComponentsContext().searchTerm;
    const [minSearchTermLength] = useDashboardComponentsContext().minSearchTermLength;

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(searchTerm);

    const canClear = Boolean(inputValue || searchTerm);

    const handleFocus = () => inputRef.current?.focus?.();
    const handleInputBlur = () => setInputValue(searchTerm);
    const handleClear = () => {
        setSearchTerm(undefined);
        setInputValue(undefined);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(event);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const searchValue = formData.get('search')?.toString()?.trim();

        if (!searchValue) {
            // Reset...
            setSearchTerm(searchValue);
            return;
        }

        if (searchValue.length < minSearchTermLength) {
            pushToast({
                type: 'warning',
                message: `Please enter at least ${minSearchTermLength} characters to search`,
            });
            return;
        }

        setSearchTerm(searchValue);
    };

    return (
        <form aria-label="Components' search" className={twMerge('join', className)} onSubmit={handleSubmit} {...rest}>
            <button className="rounded-r-full btn btn-sm join-item" type="button" onClick={handleFocus}>
                <AwesomeIcon icon="magnifying-glass" />
            </button>
            <input
                ref={inputRef}
                type="search"
                name="search"
                placeholder="Search for components"
                className="input input-sm input-bordered join-item"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onBlur={handleInputBlur}
            />
            {canClear && (
                <button className="rounded-l-full btn btn-sm join-item btn-neutral" type="button" onClick={handleClear}>
                    <AwesomeIcon icon="times" />
                </button>
            )}
        </form>
    );
}
