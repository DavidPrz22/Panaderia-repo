import { queryOptions } from "@tanstack/react-query";
import {
  getProductoFinalDetalles,
  getProductosFinales,
  getUnidadesMedida,
  getCategoriasProductoFinal,
} from "../../api/api";

export const productoFinalDetallesQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["DetallesProductoFinal", id],
    queryFn: () => getProductoFinalDetalles(id),
    staleTime: Infinity,
  });

export const productosFinalesQueryOptions = () =>
  queryOptions({
    queryKey: ["productosFinales"],
    queryFn: () => getProductosFinales(),
    staleTime: Infinity,
  });

export const unidadesMedidaQueryOptions = {
  queryKey: ["unidades-medida"],
  queryFn: getUnidadesMedida,
  staleTime: Infinity,
};

export const categoriasProductoFinalQueryOptions = {
  queryKey: ["categorias-producto-final"],
  queryFn: getCategoriasProductoFinal,
  staleTime: Infinity,
};
