import React, { useState, useCallback } from 'react';
import { SearchResultsList } from './SearchProductsContainer';
import type { searchResults } from '../types/types';

interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    onSelect: (result: searchResults) => void;
    data: { results: searchResults[] } | searchResults[] | undefined;
    isLoading: boolean;
    error: any;
    placeholder?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    query,
    setQuery,
    onSelect,
    data,
    isLoading,
    error,
    placeholder = "Buscar...",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length >= 2);
    }, [setQuery]);

    const handleSelect = useCallback((result: searchResults) => {
        setQuery('');
        setIsOpen(false);
        onSelect(result);
    }, [onSelect, setQuery]);

    const handleClear = useCallback(() => {
        setQuery('');
        setIsOpen(false);
    }, [setQuery]);

    const resultsData = (data && 'results' in data) ? data.results : (data || []);

    return (
        <div className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`mt-4 border border-gray-300 text-sm text-gray-500 w-85 rounded-md p-2 ${className}`}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        {/* Ícono de 'x' */}
                    </button>
                )}
            </div>

            {isOpen && (
                <SearchResultsList
                    results={resultsData}
                    isLoading={isLoading}
                    error={error}
                    onSelect={handleSelect}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};