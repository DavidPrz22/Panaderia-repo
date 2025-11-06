import { productosFinalesSearchOptions, transformacionesSearchOptions } from "./TransformacionQueryOptions";
import { useEffect, useState } from "react";
import { DEBOUNCE_DELAY } from "./TransformacionQueryOptions";

const useDebouncedSearch = (query: string, searchOptions: (query: string, enabled: boolean) => any) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, DEBOUNCE_DELAY);
        return () => clearTimeout(timer);
    }, [query]);

    return searchOptions(debouncedQuery, query.length >= 2);
};

export const useProductosFinalesSearch = (query: string) => {
    return useDebouncedSearch(query, productosFinalesSearchOptions);
};

export const useTransformacionesSearch = (query: string) => {
    return useDebouncedSearch(query, transformacionesSearchOptions);
};
