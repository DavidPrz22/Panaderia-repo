import type { UseFormSetValue } from "node_modules/react-hook-form/dist/types/form";
import type { UseFormWatch } from "node_modules/react-hook-form/dist/types/form";
import type { TTransformacionSchema } from "../schemas/schemas";


export type Transformacion = {
    id: number;
    nombre_transformacion: string;
    cantidad_origen: number;
    cantidad_destino: number;
    fecha_creacion: Date;
    activo: boolean;
};

export type EjecutarTransformacionFormData = {
    id: number;
    nombre_transformacion: string;
    producto_origen: string;
    producto_destino: string;
    fecha_ejecucion: Date;
    activo: boolean;
};

export type watchSetvalueTypeTransformacion = {
    watch?: UseFormWatch<TTransformacionSchema>;
    setValue?: UseFormSetValue<TTransformacionSchema>;
};  
export interface searchResults {
    id: string | number;
    nombre_producto: string;
    type: 'product' | 'user' | 'category' | 'post';
    metadata?: Record<string, any>;
};

export interface searchTerm {
    query: string;
    limit?: number;
};

export interface searchResponse {
    results: searchResults[];
};