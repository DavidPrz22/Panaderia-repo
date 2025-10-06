import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useTransformacionesSearch } from '../hooks/queries/TransformacionQueries';

interface SearchTransformacionesProps {
    onSelect: (result: searchResults) => void;
}

export const SearchTransformaciones: React.FC<SearchTransformacionesProps> = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const { data, isLoading, error } = useTransformacionesSearch(query);

    const handleSelect = (result: searchResults) => {
        console.log('Transformación seleccionada:', result);
        onSelect(result);
        setQuery('');
    };

    return (
        <div>
            <SearchInput
                query={query}
                setQuery={setQuery}
                onSelect={handleSelect}
                data={data}
                isLoading={isLoading}
                error={error}
                placeholder="Buscar transformación..."
            />
        </div>
    );
};
