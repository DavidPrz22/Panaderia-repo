import { useEffect, useState } from 'react';
import { DEBOUNCE_DELAY, clientesSearchOptions } from './ClientesQueryOptions';

const useDebouncedSearch = (query: string, searchOptions: (q: string, enabled: boolean) => any) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_DELAY);
        return () => clearTimeout(timer);
    }, [query]);

    return searchOptions(debouncedQuery, query.length >= 2);
};

export const useClientesSearch = (query: string) => {
    return useDebouncedSearch(query, clientesSearchOptions);
};

export default {};
