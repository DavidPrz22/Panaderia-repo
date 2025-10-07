import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useProductosFinalesSearch } from '../hooks/queries/TransformacionQueries';

interface SearchProductsDestinoProps {
    onSelect: (result: searchResults | null) => void;
    selectedResult: searchResults | null;
}

export const SearchProductsDestino: React.FC<SearchProductsDestinoProps> = ({ onSelect, selectedResult }) => {
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
                placeholder="Buscar producto de destino..."
            />
        </div>
    );
};
