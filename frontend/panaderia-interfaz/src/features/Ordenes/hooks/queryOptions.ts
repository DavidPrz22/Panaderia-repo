import { getClientes, getMetodosDePago, getEstadosOrden } from "../../Ordenes/api/api";

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
