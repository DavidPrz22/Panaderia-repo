import { useQueries, useQuery } from "@tanstack/react-query";
import { comprasTableQueryOptions } from "./queryOptions";
import { estadosOrdenCompraQueryOptions, proveedoresQueryOptions, metodosDePagoQueryOptions, estadosOrdenCompraRegistroQueryOptions } from "./queryOptions";

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