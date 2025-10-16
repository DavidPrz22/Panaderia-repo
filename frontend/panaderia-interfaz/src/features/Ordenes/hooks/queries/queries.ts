import { useQueries, useQuery } from "@tanstack/react-query";
import { clientesQueryOptions, metodosDePagoQueryOptions, estadosOrdenQueryOptions, bcvRateQueryOptions } from "./queryOptions";

export const useGetParametros = () => {
    return useQueries({
        queries: [clientesQueryOptions, metodosDePagoQueryOptions],
    });
};

export const useGetEstadosOrden = () => {
    return useQuery(estadosOrdenQueryOptions);
};

export const useGetBCVRate = () => {
    return useQuery(bcvRateQueryOptions);
};