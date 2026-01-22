import { productosFinalesSearchOptions, transformacionesSearchOptions, transformacionesOptions } from "./TransformacionQueryOptions";
import { useEffect, useState } from "react";
import { DEBOUNCE_DELAY } from "./TransformacionQueryOptions";
import { useQuery } from "@tanstack/react-query";

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

export const useTransformacionesQuery = () => {
    return useQuery(transformacionesOptions());
};
