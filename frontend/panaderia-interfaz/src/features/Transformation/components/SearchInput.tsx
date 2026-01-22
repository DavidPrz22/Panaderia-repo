import React, { useState, useCallback } from 'react';
import { SearchResultsList } from './SearchProductsContainer';
import type { searchResults } from '../types/types';
import { CerrarIcon } from '@/assets/DashboardAssets';
import { Input } from '@/components/ui/input';


interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    onSelect: (result: searchResults | null) => void;
    data: { results: searchResults[] } | searchResults[] | undefined;
    isLoading: boolean;
    error: any;
    selectedResult: searchResults | null;
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
    selectedResult,
    placeholder = "Buscar...",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (selectedResult) {
            onSelect(null); // Limpiar selección si el usuario empieza a escribir de nuevo
        }
        setQuery(value);
        setIsOpen(value.length >= 2);
    }, [setQuery, selectedResult, onSelect]);

    const handleSelect = useCallback((result: searchResults) => {
        setQuery(result.nombre_producto); // Mostrar el nombre en el input
        setIsOpen(false);
        onSelect(result);
    }, [onSelect, setQuery]);

    const handleClear = useCallback(() => {
        setQuery('');
        setIsOpen(false);
        onSelect(null); // Notificar que la selección ha sido limpiada
    }, [setQuery, onSelect]);

    const resultsData = (data && 'results' in data) ? data.results : (data || []);

    return (
        <div className="relative w-full">
            <div className="relative flex items-center">
                <Input
                    type="text"
                    value={selectedResult ? selectedResult.nombre_producto : query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`border border-gray-300 text-sm text-gray-500 w-full rounded-lg py-5 ${className}`}
                    disabled={!!selectedResult} // Deshabilitar input si hay una selección
                />
                {selectedResult && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 z-10"
                        aria-label="limpiar-seleccion"
                    >
                        <img src={CerrarIcon} alt="Limpiar" className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && !selectedResult && (
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