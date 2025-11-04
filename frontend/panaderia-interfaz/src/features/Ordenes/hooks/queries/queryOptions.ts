import { getClientes, getMetodosDePago, getAllEstadosOrdenVenta, getEstadosOrdenRegistro, BCVRate, getOrdenes, getOrdenesDetalles } from "../../api/api";

export const clientesQueryOptions = {
    queryKey: ["clientes"],
    queryFn: getClientes,
    staleTime: Infinity,
};

export const metodosDePagoQueryOptions = {
    queryKey: ["metodos-de-pago"],
    queryFn: getMetodosDePago,
    staleTime: Infinity,
};

export const getAllEstadosOrdenVentaQueryOptions = {
    queryKey: ["estados-orden"],
    queryFn: getAllEstadosOrdenVenta,
    staleTime: Infinity,
};

export const estadosOrdenRegistroQueryOptions = {
    queryKey: ["estados-orden-registro"],
    queryFn: getEstadosOrdenRegistro,
    staleTime: Infinity,
};

export const bcvRateQueryOptions = {
    queryKey: ["bcv-rate"],
    queryFn: BCVRate,
    staleTime: Infinity,
};

export const ordenesTableQueryOptions = {
    queryKey: ["ordenes-table"],
    queryFn: getOrdenes,
    staleTime: Infinity,
};

export const ordenesDetallesQueryOptions = (id: number) => {
    return {
        queryKey: ["ordenes-detalles", id],
        queryFn: () => getOrdenesDetalles(id),
        staleTime: Infinity,
    }
};