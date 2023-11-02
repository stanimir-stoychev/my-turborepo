'use client';

import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { AwesomeIcon } from '~/components';
import { useToaster } from '~/layout/Toaster';

import { usePageContext } from '../_context';

export function SearchField({ className, onSubmit, ...rest }: React.HtmlHTMLAttributes<HTMLFormElement>) {
    const { pushToast } = useToaster();
    const { dispatch, state } = usePageContext();

    const inputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>();

    const handleFocus = () => inputRef.current?.focus?.();

    const handleEscapeKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            event.currentTarget.blur();
        }
    };

    const handleInputBlur = () => {
        if (!inputRef.current) return;
        inputRef.current.value = searchTerm ?? '';
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(event);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const searchValue = formData.get('search')?.toString()?.trim();

        if (searchValue && searchValue.length < 3) {
            pushToast({
                type: 'warning',
                message: 'Please enter at least 3 characters to search',
            });
            return;
        }

        setSearchTerm(searchValue);
        dispatch({
            type: 'search-components',
            payload: { any: searchValue },
        });
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
                onBlur={handleInputBlur}
                onKeyDown={handleEscapeKeyPress}
            />
        </form>
    );
}
