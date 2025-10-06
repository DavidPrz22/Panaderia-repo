import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import type { searchResults } from '../types/types';
import { useProductosFinalesSearch } from '../hooks/queries/TransformacionQueries';

interface SearchProductsOriginProps {
    onSelect: (result: searchResults) => void;
}

export const SearchProductsOrigin: React.FC<SearchProductsOriginProps> = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const { data, isLoading, error } = useProductosFinalesSearch(query);

    const handleSelect = (result: searchResults) => {
        console.log('Producto de origen seleccionado:', result);
        onSelect(result);
        setQuery(''); // Limpiar el input después de seleccionar
    };

    return (
        <div>
            <SearchInput
                query={query}
                setQuery={setQuery}
                onSelect={handleSelect}
                data={data} // Pasamos el objeto de datos completo
                isLoading={isLoading}
                error={error}
                placeholder="Buscar producto de origen..."
            />
        </div>
    );
};
