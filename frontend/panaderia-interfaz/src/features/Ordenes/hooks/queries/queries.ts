import { useQueries, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  clientesQueryOptions,
  metodosDePagoQueryOptions,
  getAllEstadosOrdenVentaQueryOptions,
  estadosOrdenRegistroQueryOptions,
  bcvRateQueryOptions,
  ordenesDetallesQueryOptions,
} from "./queryOptions";
import { ordenesTableQueryOptions } from "./queryOptions";

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

export const useGetOrdenesTable = () => {
  return useInfiniteQuery(ordenesTableQueryOptions);
};

export const useGetOrdenesDetalles = (id: number) => {
  return useQuery({
    ...ordenesDetallesQueryOptions(id),
    enabled: !!id,
  });
};
