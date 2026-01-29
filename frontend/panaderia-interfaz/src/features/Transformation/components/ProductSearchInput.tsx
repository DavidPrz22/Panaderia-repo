import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useProductSearchQuery } from '../hooks/queries/TransformacionQueries';

interface ProductSearchInputProps {
    type: 'origen' | 'destino';
    onSelect: (result: searchResults | null) => void;
    selectedResult: searchResults | null;
    placeholder?: string;
    className?: string;
}

export const ProductSearchInput: React.FC<ProductSearchInputProps> = ({
    type,
    onSelect,
    selectedResult,
    placeholder,
    className
}) => {
    const [query, setQuery] = useState('');
    const { data, isLoading, error } = useProductSearchQuery(query, type);

    const defaultPlaceholder = type === 'origen'
        ? "Buscar producto de origen..."
        : "Buscar producto de destino...";

    return (
        <div className="w-full">
            <SearchInput
                query={query}
                setQuery={setQuery}
                onSelect={onSelect}
                data={data}
                isLoading={isLoading}
                error={error}
                selectedResult={selectedResult}
                placeholder={placeholder || defaultPlaceholder}
                className={className || 'focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300'}
            />
        </div>
    );
};
