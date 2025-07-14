import type { UseFormRegister, Path, FieldErrors } from "react-hook-form";
import type { TLoginUserSchema, TMateriaPrimaSchema, TLoteMateriaPrimaSchema } from "@/lib/schemas";
import type { ReactNode, MouseEvent } from 'react';

export const API: string = import.meta.env.VITE_API_URL as string;

export type RegisterUser = {
    username: string;   
    email: string;
    full_name: string;
    password: string;
    repassword: string;
    rol: string;
}

export type LoginUserType = {
    placeholder: string,
    type: string,
    name: Path<TLoginUserSchema>,
    register: UseFormRegister<TLoginUserSchema>
}


export interface SidebarCardProps {
    children: ReactNode;
    icon: string;
    onclick: (e: MouseEvent<HTMLDivElement>) => void;
    link?: string;
} 

export type childrenProp = {
    children: ReactNode;
}

export type UnidadMedida = {
    id: number;
    nombre_completo: string;
    abreviatura: string;
    descripcion: string | null;
    tipo_medida: 'peso' | 'volumen' | 'unidad';
}

export type CategoriaMateriaPrima = {
    id: number;
    nombre_categoria: string;
    descripcion: string | null;
}


export type MateriaPrimaList = {
    id: number;
    name: string;
    unit: string;
    category: string;
    quantity: number;
    reorderPoint: number;
    creationDate: string;
}

export type MateriaPrimaListServer = {
    id: number;
    nombre: string;
    unidad_medida_base_detail: UnidadMedida;
    categoria_detail: CategoriaMateriaPrima;
    stock_actual: number;
    SKU: string;
    nombre_empaque_estandar: string;
    cantidad_empaque_estandar: number;
    unidad_medida_empaque_estandar_detail: UnidadMedida;
    punto_reorden: number;
    fecha_ultima_actualizacion: string;
    fecha_creacion_registro: string;
    fecha_modificacion_registro: string;
    descripcion: string;
}

export type MateriaPrimaFormSharedProps = {
    isUpdate?: boolean;
    initialData?: MateriaPrimaListServer;
    onClose: () => void;
    onSubmitSuccess: () => void;
    title: string;
}

export type MateriaPrimaFormInputContainerProps = {
    inputType: string;
    title: string;
    name: keyof TMateriaPrimaSchema;
    register: UseFormRegister<TMateriaPrimaSchema>;
    errors: FieldErrors<TMateriaPrimaSchema>;
    optional?: boolean;
}

export type MateriaPrimaFormSelectContainerProps = {
    title: string;
    name: keyof TMateriaPrimaSchema;
    register: UseFormRegister<TMateriaPrimaSchema>;
    errors: FieldErrors<TMateriaPrimaSchema>;
    children: ReactNode;
    optional?: boolean;
}

export type LoteMateriaPrima = {
    id: number;
    fecha_recepcion: string;
    fecha_caducidad: string;
    cantidad_recibida: number;
    stock_actual_lote: number;
    costo_unitario_usd: number;
    proveedor: string;
    activo: boolean;
}

export type Proveedor = {
    id?: number;
    nombre_proveedor: string;
    apellido_proveedor: string;
    nombre_comercial: string;
    email_contacto: string;
    telefono_contacto: string;
    fecha_creacion_registro: string;
    usuario_registro: number | null;
    notas: string | null;
}

export type LotesMateriaPrimaFormInputContainerProps = {
    inputType: string;
    title: string;
    name: keyof TLoteMateriaPrimaSchema;
    register: UseFormRegister<TLoteMateriaPrimaSchema>;
    errors: FieldErrors<TLoteMateriaPrimaSchema>;
    optional?: boolean;
}

export type LotesMateriaPrimaFormSelectContainerProps = {
    title: string;
    name: keyof TLoteMateriaPrimaSchema;
    register: UseFormRegister<TLoteMateriaPrimaSchema>;
    errors: FieldErrors<TLoteMateriaPrimaSchema>;
    children: ReactNode;
}

export type LoteMateriaPrimaFormResponse = {
    id?: number;
    materia_prima: number;
    proveedor: Proveedor;
    fecha_recepcion: Date;
    fecha_caducidad: Date;
    cantidad_recibida: number;
    stock_actual_lote: number;
    costo_unitario_usd: number;
    detalle_oc: number | null;
    activo?: boolean;
}

export type emptyLoteMateriaPrima = {
    materia_prima: number;
    empty: true;
} 

export type LoteMateriaPrimaFormSumit =  {
    id?: number;
    materia_prima: number;
    proveedor_id: number;
    fecha_recepcion: Date;
    fecha_caducidad: Date;
    cantidad_recibida: number;
    stock_actual_lote: number;
    costo_unitario_usd: number;
    detalle_oc: number | null;
    activo?: boolean;
}

export type LotesMateriaPrimaFormSharedProps = {
    isUpdate?: boolean;
    initialData?: LoteMateriaPrimaFormResponse;
    onClose: () => void;
    onSubmitSuccess: () => void;
    title: string;
}