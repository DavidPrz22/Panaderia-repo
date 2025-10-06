import { searchProductosFinales, searchTransformaciones } from "@/features/Transformation/api/api";
import { useQuery } from "@tanstack/react-query";

export const DEBOUNCE_DELAY = 300;

export const productosFinalesSearchOptions = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ["productosFinalesSearch", query],
        queryFn: () => searchProductosFinales.search({ query, limit: 10 }),
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const transformacionesSearchOptions = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ["transformacionesSearch", query],
        queryFn: () => searchTransformaciones.search({ query, limit: 10 }),
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};



