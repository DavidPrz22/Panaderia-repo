import {
  getCategoriasProductosReventa,
  getLotesProductosReventa,
  getProductosReventa,
  getProductosReventaDetalles,
  getUnidadesMedida,
  getProveedores,
} from "../../api/api";

export const unidadesMedidaQueryOptions = {
  queryKey: ["unidades-medida"],
  queryFn: getUnidadesMedida,
  staleTime: Infinity,
};

export const categoriasProductosReventaQueryOptions = {
  queryKey: ["categorias-productos-reventa"],
  queryFn: getCategoriasProductosReventa,
  staleTime: Infinity,
};

export const proveedoresQueryOptions = {
  queryKey: ["proveedores"],
  queryFn: getProveedores,
  staleTime: Infinity,
};

export const productosReventaQueryOptions = {
  queryKey: ["productos-reventa"],
  queryFn: getProductosReventa,
  staleTime: Infinity,
};

export const productosReventaDetallesQueryOptions = (id: number) => ({
  queryKey: ["productos-reventa-detalles", id],
  queryFn: () => getProductosReventaDetalles(id),
  staleTime: Infinity,
});

export const lotesProductosReventaQueryOptions = (id: number) => ({
  queryKey: ["lotes-productos-reventa", id],
  queryFn: () => getLotesProductosReventa(id),
  staleTime: Infinity,
});
