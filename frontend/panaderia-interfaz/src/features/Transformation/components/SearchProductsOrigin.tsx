import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useProductosFinalesSearch } from '../hooks/queries/TransformacionQueries';

interface SearchProductsOriginProps {
    onSelect: (result: searchResults | null) => void;
    selectedResult: searchResults | null;
}

export const SearchProductsOrigin: React.FC<SearchProductsOriginProps> = ({ onSelect, selectedResult }) => {
    const [query, setQuery] = useState('');
    const { data, isLoading, error } = useProductosFinalesSearch(query);

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
                placeholder="Buscar producto de origen..."
                className='focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300'
            />
        </div>
    );
};
