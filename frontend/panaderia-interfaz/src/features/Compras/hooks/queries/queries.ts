import { useQueries, useQuery } from "@tanstack/react-query";
import { bcvRateQueryOptions, ordenesCompraTableQueryOptions } from "./queryOptions";
import { estadosOrdenCompraQueryOptions, proveedoresQueryOptions, metodosDePagoQueryOptions, estadosOrdenCompraRegistroQueryOptions, ordenesCompraDetallesQueryOptions, unidadesMedidaQueryOptions } from "./queryOptions";

export const useGetOrdenesCompraTable = () => {
    return useQuery(ordenesCompraTableQueryOptions)
};

export const useGetAllEstadosOrdenCompra = () => {
    return useQuery(estadosOrdenCompraQueryOptions)
};

export const useGetParametros = () => {
    return useQueries({
        queries: [proveedoresQueryOptions, metodosDePagoQueryOptions, unidadesMedidaQueryOptions],
    });
};

export const useGetEstadosOrdenCompraRegistro = () => {
    return useQuery(estadosOrdenCompraRegistroQueryOptions);
};

export const useGetBCVRate = () => {
    return useQuery(bcvRateQueryOptions);
};

export const useGetOrdenesCompraDetalles = (id: number) => {
    return useQuery(ordenesCompraDetallesQueryOptions(id));
};