import { getTransformaciones, searchProducts, searchTransformaciones } from "@/features/Transformation/api/api";
import { queryOptions } from "@tanstack/react-query";

export const DEBOUNCE_DELAY = 300;

export const transformacionesOptions = () => {
    return queryOptions({
        queryKey: ["transformaciones"],
        queryFn: () => getTransformaciones(),
        staleTime: Infinity,
    });
};

export const transformacionesSearchOptions = (query: string, enabled: boolean = false) => {
    return queryOptions({
        queryKey: ["transformacionesSearch", query],
        queryFn: () => searchTransformaciones({ query, limit: 10 }),
        enabled: enabled && query.length >= 2,
        staleTime: Infinity,
        select: (data) => {
            // Filtrar resultados en frontend si la API no lo hace
            if (!data || !data.results) return { results: [] };
            const lowerQuery = query.toLowerCase();
            return {
                results: data.results.filter((item: any) =>
                    item.nombre_producto && item.nombre_producto.toLowerCase().includes(lowerQuery)
                )
            };
        }
    });
};

export const productSearchOptions = (query: string, type: 'origen' | 'destino', enabled: boolean = false) => {
    return queryOptions({
        queryKey: ['products', 'search', type, query],
        queryFn: () => searchProducts(query, type),
        enabled: enabled && query.trim().length >= 2,
        staleTime: Infinity,
    });
};



