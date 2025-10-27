import { getProveedores, getOrdenesCompras, getOrdenesComprasDetalles, getBCVRate , getAllEstadosOrdenCompra, getMetodosDePago, getEstadosOrdenCompraRegistro } from "../../api/api";

export const proveedoresQueryOptions = {
    queryKey: ["proveedores"],
    queryFn: getProveedores,
    staleTime: Infinity,
};

export const comprasTableQueryOptions = {
    queryKey: ["compras-table"],
    queryFn: getOrdenesCompras,
    staleTime: Infinity,
};

export const comprasDetallesQueryOptions = (id: number) => {
    return {
        queryKey: ["compras-detalles", id],
        queryFn: () => getOrdenesComprasDetalles(id),
        staleTime: Infinity,
    }
};

export const metodosDePagoQueryOptions = {
    queryKey: ["metodos-de-pago"],
    queryFn: getMetodosDePago,
    staleTime: Infinity,
};

export const bcvRateQueryOptions = {
    queryKey: ["bcv-rate"],
    queryFn: getBCVRate,
    staleTime: Infinity,
};

export const estadosOrdenCompraQueryOptions = {
    queryKey: ["estados-orden-compra"],
    queryFn: getAllEstadosOrdenCompra,
    staleTime: Infinity,
};

export const estadosOrdenCompraRegistroQueryOptions = {
    queryKey: ["estados-orden-compra-registro"],
    queryFn: getEstadosOrdenCompraRegistro,
    staleTime: Infinity,
};
