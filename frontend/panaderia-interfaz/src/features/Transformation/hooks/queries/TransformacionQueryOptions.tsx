import { searchProductosFinales, searchTransformaciones } from "@/features/Transformation/api/api";
import { useQuery } from "@tanstack/react-query";

export const DEBOUNCE_DELAY = 300;


export const productosFinalesSearchOptions = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ["productosFinalesSearch", query],
        queryFn: () => searchProductosFinales.search({ query, limit: 10 }),
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutos
        select: (data) => {
            // Debug: Ver datos recibidos de la API
            console.log('API productosFinalesSearchOptions data:', data);
            if (!data || !data.results) return { results: [] };
            const lowerQuery = query.toLowerCase();
            const filtered = data.results.filter((item: any) => {
                if (item.nombre_producto && item.nombre_producto.toLowerCase().includes(lowerQuery)) return true;
                if (item.producto_origen && item.producto_origen.toLowerCase().includes(lowerQuery)) return true;
                if (item.producto_destino && item.producto_destino.toLowerCase().includes(lowerQuery)) return true;
                return false;
            });
            // Debug: Ver resultados filtrados
            console.log('Filtrados productosFinalesSearchOptions:', filtered);
            return { results: filtered };
        }
    });
};

export const transformacionesSearchOptions = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ["transformacionesSearch", query],
        queryFn: () => searchTransformaciones.search({ query, limit: 10 }),
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutos
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



