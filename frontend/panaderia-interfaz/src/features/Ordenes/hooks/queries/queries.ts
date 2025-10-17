import { useQueries, useQuery } from "@tanstack/react-query";
import { clientesQueryOptions, metodosDePagoQueryOptions, getAllEstadosOrdenVentaQueryOptions, estadosOrdenRegistroQueryOptions, bcvRateQueryOptions } from "./queryOptions";

export const useGetParametros = () => {
    return useQueries({
        queries: [clientesQueryOptions, metodosDePagoQueryOptions],
    });
};

export const useGetAllEstadosOrdenVenta = () => {
    return useQuery(getAllEstadosOrdenVentaQueryOptions);
};

export const useGetEstadosOrdenRegistro = () => {
    return useQuery(estadosOrdenRegistroQueryOptions);
};

export const useGetBCVRate = () => {
    return useQuery(bcvRateQueryOptions);
};