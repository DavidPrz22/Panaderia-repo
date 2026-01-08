import { queryOptions } from "@tanstack/react-query";
import {
  getProductoFinalDetalles,
  getProductosFinales,
  getUnidadesMedida,
  getCategoriasProductoFinal,
  getLotesProductosFinales,
} from "../../api/api";
import type { LoteProductoFinalPagination } from "../../types/types";

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

export const lotesProductosFinalesQueryOptions = (producto_final_id?: number) => ({
  queryKey: ["lotes-productos-finales-paginated", producto_final_id],
  queryFn: ({ pageParam }: { pageParam?: string | null }) =>
    getLotesProductosFinales({ pageParam, producto_final_id }),
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: LoteProductoFinalPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: LoteProductoFinalPagination) => firstPage.previous,
});