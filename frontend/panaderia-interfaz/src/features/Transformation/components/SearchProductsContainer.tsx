import React, { useRef, useEffect } from 'react';
import type { searchResults } from '../types/types';
import { ResultItem } from './TransfProductSearchTerm';

interface SearchResultsListProps {
    results: searchResults[];
    isLoading: boolean;
    error: any;
    onSelect: (result: searchResults) => void;
    onClose: () => void;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
    results,
    isLoading,
    error,
    onSelect,
    onClose,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (error) {
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div className="p-4 text-red-600">Error al buscar</div>
        </div>
    );
    }

    if (isLoading) {
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div className="p-4 text-gray-500">Buscando...</div>
        </div>
    );
    }

    if (results.length === 0) {
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div className="p-4 text-gray-500">No se encontraron resultados</div>
        </div>
    );
    }

    return (
    <div 
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
    >
        {results.map((result) => (
        <ResultItem
            key={`${result.type}-${result.id}`}
            result={result}
            onClick={() => onSelect(result)}
        />
        ))}
    </div>
    );
};