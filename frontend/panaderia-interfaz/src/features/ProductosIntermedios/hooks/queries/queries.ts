import { useQueries } from "@tanstack/react-query";
import { unidadesMedidaQueryOptions } from "./queryOptions";
import { categoriasProductoIntermedioQueryOptions } from "./queryOptions";



export const useGetParametros = () => {
    return useQueries({
        queries: [
            unidadesMedidaQueryOptions,
            categoriasProductoIntermedioQueryOptions,
        ],
        
    });
};