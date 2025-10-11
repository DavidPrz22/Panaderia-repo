import { useQueries, useQuery } from "@tanstack/react-query";
import { clientesQueryOptions, metodosDePagoQueryOptions, estadosOrdenQueryOptions } from "./queryOptions";

export const useGetParametros = () => {
    return useQueries({
        queries: [clientesQueryOptions, metodosDePagoQueryOptions],
    });
};

export const useGetEstadosOrden = () => {
    return useQuery(estadosOrdenQueryOptions);
};