import { productSearchOptions, transformacionesSearchOptions, transformacionesOptions } from "./TransformacionQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_DELAY } from "./TransformacionQueryOptions";

export const useTransformacionesSearch = (query: string) => {
    const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
    return useQuery(transformacionesSearchOptions(debouncedQuery, query.length >= 2));
};

export const useTransformacionesQuery = () => {
    return useQuery(transformacionesOptions());
};

export const useProductSearchQuery = (query: string, type: 'origen' | 'destino') => {
    const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
    return useQuery(productSearchOptions(debouncedQuery, type, query.length >= 2));
};
