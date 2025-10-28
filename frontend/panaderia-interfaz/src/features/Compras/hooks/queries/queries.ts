import { useQueries, useQuery } from "@tanstack/react-query";
import { bcvRateQueryOptions, comprasTableQueryOptions } from "./queryOptions";
import { estadosOrdenCompraQueryOptions, proveedoresQueryOptions, metodosDePagoQueryOptions, estadosOrdenCompraRegistroQueryOptions, comprasDetallesQueryOptions } from "./queryOptions";

export const useGetComprasTable = () => {
    return useQuery(comprasTableQueryOptions)
};

export const useGetAllEstadosOrdenCompra = () => {
    return useQuery(estadosOrdenCompraQueryOptions)
};

export const useGetParametros = () => {
    return useQueries({
        queries: [proveedoresQueryOptions, metodosDePagoQueryOptions],
    });
};

export const useGetEstadosOrdenCompraRegistro = () => {
    return useQuery(estadosOrdenCompraRegistroQueryOptions);
};

export const useGetBCVRate = () => {
    return useQuery(bcvRateQueryOptions);
};

export const useGetOrdenesDetalles = (id: number) => {
    return useQuery(comprasDetallesQueryOptions(id));
};