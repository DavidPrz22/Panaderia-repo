import { getCategoriasProductoIntermedio, getUnidadesMedida } from "../../api/api";

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