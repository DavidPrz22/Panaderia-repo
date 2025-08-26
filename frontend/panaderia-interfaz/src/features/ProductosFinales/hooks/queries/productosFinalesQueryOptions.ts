import { queryOptions } from "@tanstack/react-query";
import {
  getProductoFinalDetalles,
  getProductosFinales,
  getUnidadesMedida,
  getCategoriasProductoFinal
} from "../../api/api";


export const productoFinalDetallesQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["DetallesProductoFinal", id],
    queryFn: () => getProductoFinalDetalles(id)
  });

export const productosFinalesQueryOptions = () =>
  queryOptions({
    queryKey: ["productosFinales"],
    queryFn: () => getProductosFinales()
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