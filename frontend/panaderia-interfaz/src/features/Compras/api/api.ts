
import apiClient from "@/api/client";
import axios from "axios";
import type { OrdenCompraTable, ProveedorRegistro, OrdenCompra, EstadoOC, MetodoDePago, Producto } from "../types/types";

export const getProveedores = async (): Promise<ProveedorRegistro[]> => {
    try {
        const response = await apiClient.get("/api/proveedores/compra_registro/");
        return response.data;
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        return [];
    }
};

export const getOrdenesCompras = async (): Promise<OrdenCompraTable[]> => {
    try {
        const response = await apiClient.get("/api/compras/");
        return response.data;
    } catch (error) {
        console.error("Error fetching compras:", error);
        return [];
    }
};

export const getEstadosOrdenCompraRegistro = async (): Promise<EstadoOC[]> => {
    try {
        const response = await apiClient.get("/api/estados-orden-compra/get_estados_registro/");
        return response.data;
    } catch (error) {
        console.error("Error fetching estados orden compra registro:", error);
        return [];
    }
};

export const getOrdenesComprasDetalles = async (id: number): Promise<OrdenCompra> => {
    try {
        const response = await apiClient.get(`/api/compras/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching compras detalles:", error);
        throw error;
    }
};

export const getMetodosDePago = async (): Promise<MetodoDePago[]> => {
    try {
        const response = await apiClient.get("/api/metodos-de-pago/");
        return response.data;
    } catch (error) {
        console.error("Error fetching metodos de pago:", error);
        return [];
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

export const getAllEstadosOrdenCompra = async (): Promise<EstadoOC[]> => {
    try {
        const response = await apiClient.get("/api/estados-orden-compra/");
        return response.data;
    } catch (error) {
        console.error("Error fetching estados orden compra:", error);
        return [];
    }
};

type ProductosOCSearchType = {
    productos: Producto[];
}
export const searchProductosOC = async (search: string): Promise<ProductosOCSearchType> => {
    try {
        const response = await apiClient.get(`/api/productos-compras-search/?search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching productos:", error);
        throw error;
    }
};  