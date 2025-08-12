import { getCategoriasProductoIntermedio, getProductosIntermedios, getProductosIntermediosDetalles, getUnidadesMedida } from "../../api/api";

export const unidadesMedidaQueryOptions = {
    queryKey: ["unidades-medida"],
    queryFn: getUnidadesMedida,
    staleTime: Infinity,
};

export const categoriasProductoIntermedioQueryOptions = {
    queryKey: ["categorias-producto-intermedio"],
    queryFn: getCategoriasProductoIntermedio,
    staleTime: Infinity,
};

export const productosIntermediosQueryOptions = {
    queryKey: ["productos-intermedios"],
    queryFn: getProductosIntermedios,
    staleTime: Infinity,
};


export const productosIntermediosDetallesQueryOptions = (id: number) => ({
    queryKey: ["productos-intermedios-detalles", id],
    queryFn: () => getProductosIntermediosDetalles(id),
    staleTime: Infinity
})  ;