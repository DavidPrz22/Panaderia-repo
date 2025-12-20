import apiClient from "@/api/client";
import type { TAperturaCaja } from "../schemas/schemas";
import axios from "axios";
import type { Cliente, Producto, Categorias } from "../types/types";

type CheckIsActiveResponse = {
    is_active: boolean;
}

export const checkIsActive = async (): Promise<CheckIsActiveResponse> => {
    try {
        const response = await apiClient.get("/api/apertura-cierre-caja/is-active/");
        return response.data;
    } catch (error) {
        console.error("Error checking if caja is active:", error);
        throw error;
    }
};

export const aperturaCaja = async (data: TAperturaCaja): Promise<CheckIsActiveResponse> => {
    try {
        const response = await apiClient.post("/api/apertura-cierre-caja/", data);
        return response.data;
    } catch (error) {
        console.error("Error opening caja:", error);
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

export const BCVRate = async (): Promise<BCVRateType> => {
  try {
    const response = await axios.get(
      `https://ve.dolarapi.com/v1/dolares/oficial`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching BCV rate:", error);
    throw error;
  }
};

export const getClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await apiClient.get("/api/clientes/");
    return response.data;
  } catch (error) {
    console.error("Error fetching clientes:", error);
    throw error;
  }
};



export const getProductos = async (): Promise<{productos: Producto[]}> => {
    try {
        const response = await apiClient.get("/api/caja-productos-lista/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching productos:", error);
        throw error;
    }
};

export const getCategorias = async (): Promise<{categorias: Categorias}> => {
    try {
        const response = await apiClient.get("/api/caja-categorias/");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching categorias:", error);
        throw error;
    }
};