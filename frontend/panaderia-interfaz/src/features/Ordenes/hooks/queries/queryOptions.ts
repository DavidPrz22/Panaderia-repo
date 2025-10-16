import { getClientes, getMetodosDePago, getEstadosOrden, BCVRate } from "../../api/api";

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

export const estadosOrdenQueryOptions = {
    queryKey: ["estados-orden"],
    queryFn: getEstadosOrden,
    staleTime: Infinity,
};

export const bcvRateQueryOptions = {
    queryKey: ["bcv-rate"],
    queryFn: BCVRate,
    staleTime: Infinity,
};