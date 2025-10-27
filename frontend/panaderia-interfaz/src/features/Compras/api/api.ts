
import apiClient from "@/api/client";
import axios from "axios";

export const getProveedores = async (): Promise<any> => {
    try {
        const response = await apiClient.get("/api/proveedores/");
        return response.data;
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        return [];
    }
};

export const getCompras = async (): Promise<any> => {
    try {
        const response = await apiClient.get("/api/compras/");
        return response.data;
    } catch (error) {
        console.error("Error fetching compras:", error);
        return [];
    }
};

export const getComprasDetalles = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get(`/api/compras/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching compras detalles:", error);
        return null;
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

export const getBCVRate = async () : Promise<BCVRateType> => {
    try {
        const response = await axios.get(`https://ve.dolarapi.com/v1/dolares/oficial`);
        return response.data;
    } catch (error) {
        console.error("Error fetching BCV rate:", error);
        throw error;
    }
};
