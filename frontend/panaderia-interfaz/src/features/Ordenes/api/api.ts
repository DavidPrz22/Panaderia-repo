import apiClient from "@/api/client";
import type { Cliente, EstadoOrden, MetodoPago } from "../types/types";

export const getClientes = async () : Promise<Cliente[]> => {
    try {
        const response = await apiClient.get("/api/ventas/clientes/");
        return response.data;
    } catch (error) {
        console.error("Error fetching clientes:", error);
        throw error;
    }
};

export const getMetodosDePago = async () : Promise<MetodoPago[] > => {
    try {
        const response = await apiClient.get("/api/core/metodos-de-pago/");
        return response.data;
    } catch (error) {
        console.error("Error fetching metodos de pago:", error);
        throw error;
    }
};

export const getEstadosOrden = async (): Promise<EstadoOrden[]> => {
    try {
        const response = await apiClient.get("/api/core/estados-orden-venta/");
        return response.data;
    } catch (error) {
        console.error("Error fetching estados de orden:", error);
        throw error;
    }
};
