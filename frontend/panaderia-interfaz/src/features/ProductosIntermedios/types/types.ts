import type { ReactNode } from "react";
import type { FieldErrors, Path, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { TProductosIntermediosSchema } from "../schemas/schema";

export type childrenProp = {
    children: ReactNode;
};

export type ProductosIntermediosFormSharedProps = {
    title: string;
    isUpdate?: boolean;
    initialData?: TProductosIntermediosSchema;
    onClose: () => void;
    onSubmitSuccess: () => void;
};

export type PIFormInputContainerProps = {
    inputType: string;
    title: string;
    name: Path<TProductosIntermediosSchema>;
    register: UseFormRegister<TProductosIntermediosSchema>;
    errors: FieldErrors<TProductosIntermediosSchema>;
    optional?: boolean;
    search?: boolean;
};

export type PIFormInputProps = {
    register: UseFormRegister<TProductosIntermediosSchema>;
    name: Path<TProductosIntermediosSchema>;
    typeInput: string;
    placeholder?: string;
};

export type PIFormSelectContainerProps = {
    title: string;
    name: Path<TProductosIntermediosSchema>;
    register: UseFormRegister<TProductosIntermediosSchema>;
    errors: FieldErrors<TProductosIntermediosSchema>;
    children: ReactNode;
    optional?: boolean;
};


export type recetasSearchItem = {
    id: number;
    nombre: string;
}

export type UnidadesDeMedida = {
    id: number;
    nombre_completo: string;
    abreviatura: string;
}

export type CategoriaProductoIntermedio = {
    id: number;
    nombre_categoria: string;
}

export type setValueProps = {
    setValue?: UseFormSetValue<TProductosIntermediosSchema>,
}


export type ProductosIntermedios = {
    id: number;
    nombre_producto: string;
    SKU: string;
    stock_actual: number;
    punto_reorden: number;
    categoria_nombre: string;
    fecha_creacion_registro: string;
}

export type ProductosIntermediosDetalles = {
    id: number;
    nombre_producto: string;
    SKU: string;
    stock_actual: number;
    punto_reorden: number;
    categoria_nombre: string;
    fecha_creacion_registro: string;
    fecha_modificacion_registro: string;
    descripcion: string;
    receta_relacionada: string;
}