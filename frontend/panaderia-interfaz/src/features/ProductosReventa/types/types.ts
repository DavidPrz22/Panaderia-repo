import type { ReactNode } from "react";
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { TProductosReventaSchema } from "../schemas/schema";

export type childrenProp = {
  children: ReactNode;
};

export type ProductosReventaFormSharedProps = {
  title: string;
  isUpdate?: boolean;
  initialData?: ProductosReventaDetalles;
  onClose: () => void;
  onSubmitSuccess: () => void;
};

export type PRFormInputContainerProps = {
  inputType: string;
  title: string;
  name: Path<TProductosReventaSchema>;
  register: UseFormRegister<TProductosReventaSchema>;
  errors: FieldErrors<TProductosReventaSchema>;
  optional?: boolean;
};

export type PRFormInputProps = {
  register: UseFormRegister<TProductosReventaSchema>;
  name: Path<TProductosReventaSchema>;
  typeInput: string;
  placeholder?: string;
};

export type PRFormSelectContainerProps = {
  title: string;
  name: Path<TProductosReventaSchema>;
  register: UseFormRegister<TProductosReventaSchema>;
  errors: FieldErrors<TProductosReventaSchema>;
  children: ReactNode;
  optional?: boolean;
};

export type UnidadesDeMedida = {
  id: number;
  nombre_completo: string;
  abreviatura: string;
};

export type CategoriaProductosReventa = {
  id: number;
  nombre_categoria: string;
};

export type Proveedor = {
  id: number;
  nombre_proveedor: string;
};

export type setValueProps = {
  setValue?: UseFormSetValue<TProductosReventaSchema>;
};

export type ProductosReventa = {
  id: number;
  nombre_producto: string;
  SKU: string | null;
  stock_actual: number;
  precio_venta_usd: number;
  categoria_nombre: string;
  marca: string | null;
  fecha_creacion_registro: string;
};

export type ProductosReventaDetalles = {
  id: number;
  nombre_producto: string;
  descripcion: string | null;
  SKU: string | null;
  categoria: { id: number; nombre_categoria: string };
  marca: string | null;
  proveedor_preferido: { id: number; nombre_proveedor: string } | null;
  unidad_base_inventario: { id: number; nombre_completo: string; abreviatura: string };
  unidad_venta: { id: number; nombre_completo: string; abreviatura: string };
  factor_conversion: number;
  stock_actual: number;
  precio_venta_usd: number;
  costo_ultima_compra_usd: number;
  pecedero: boolean;
  fecha_creacion_registro: string;
  fecha_modificacion_registro: string;
};
