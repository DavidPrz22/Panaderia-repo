import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useTransformacionesSearch } from '../hooks/queries/TransformacionQueries';

interface SearchTransformacionesProps {
    onSelect: (result: searchResults | null) => void;
    selectedResult: searchResults | null;
}

export const SearchTransformaciones: React.FC<SearchTransformacionesProps> = ({ onSelect, selectedResult }) => {
    const [query, setQuery] = useState('');
    const { data, isLoading, error } = useTransformacionesSearch(query);

    return (
        <div>
            <SearchInput
                query={query}
                setQuery={setQuery}
                onSelect={onSelect}
                data={data}
                isLoading={isLoading}
                error={error}
                selectedResult={selectedResult}
                placeholder="Buscar transformación..."
            />
        </div>
    );
};
