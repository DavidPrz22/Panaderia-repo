import apiClient from "@/api/client";
import type { Cliente, EstadoOrden, MetodoPago, OrdenProductosSearch } from "../types/types";
import axios from "axios";
import type { TOrderSchema } from "../schema/schema";

export const getClientes = async () : Promise<Cliente[]> => {
    try {
        const response = await apiClient.get("/api/clientes/");
        return response.data;
    } catch (error) {
        console.error("Error fetching clientes:", error);
        throw error;
    }
};

export const getMetodosDePago = async () : Promise<MetodoPago[] > => {
    try {
        const response = await apiClient.get("/api/metodos-de-pago/");
        return response.data;
    } catch (error) {
        console.error("Error fetching metodos de pago:", error);
        throw error;
    }
};

export const getAllEstadosOrdenVenta = async (): Promise<EstadoOrden[]> => {
    try {
        const response = await apiClient.get("/api/estados-orden-venta/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching estados de orden:", error);
        throw error;
    }
};

export const getEstadosOrdenRegistro = async (): Promise<EstadoOrden[]> => {
    try {
        const response = await apiClient.get("/api/estados-orden-venta/get-estados-registro/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching estados de orden:", error);
        throw error;
    }
};

export const getOrdenProductosSearch = async (search: string) : Promise<OrdenProductosSearch> => {
    try {
        const response = await apiClient.get("/api/productos-pedidos-search/", {
            params: {
                search,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orden productos search:", error);
        throw error;
    }
};

export type BCVRateType = {
    fuente: string;
    nombre: string;
    compra: number;
    venta: number;
    promedio: number;
    fechaActualizacion: string;
};

export const BCVRate = async () : Promise<BCVRateType> => {
    try {
        const response = await axios.get(`https://ve.dolarapi.com/v1/dolares/oficial`);
        return response.data;
    } catch (error) {
        console.error("Error fetching BCV rate:", error);
        throw error;
    }
};

export const createOrden = async (data: TOrderSchema) => {
    try {
        const response = await apiClient.post("/api/ordenes/", data);
        return response.data;
    } catch (error) {
        console.error("Error creating orden:", error);
        throw error;
    }
};