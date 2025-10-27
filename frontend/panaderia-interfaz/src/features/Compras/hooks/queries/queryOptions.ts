import { getProveedores, getCompras, getComprasDetalles, getBCVRate } from "../../api/api";

export const proveedoresQueryOptions = {
    queryKey: ["proveedores"],
    queryFn: getProveedores,
    staleTime: Infinity,
};

export const comprasTableQueryOptions = {
    queryKey: ["compras-table"],
    queryFn: getCompras,
    staleTime: Infinity,
};

export const comprasDetallesQueryOptions = (id: number) => {
    return {
        queryKey: ["compras-detalles", id],
        queryFn: () => getComprasDetalles(id),
        staleTime: Infinity,
    }
};

export const bcvRateQueryOptions = {
    queryKey: ["bcv-rate"],
    queryFn: getBCVRate,
    staleTime: Infinity,
};
