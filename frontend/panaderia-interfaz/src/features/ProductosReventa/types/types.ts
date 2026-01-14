import type { ReactNode } from "react";
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { TProductosReventaSchema, TLoteProductosReventaSchema } from "../schemas/schema";

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

export type InputType = "text" | "number" | "textarea";

export type PRFormInputContainerProps = {
  inputType: InputType;
  title: string;
  name: Path<TProductosReventaSchema>;
  register: UseFormRegister<TProductosReventaSchema>;
  errors: FieldErrors<TProductosReventaSchema>;
  optional?: boolean;
};

export type PRFormInputProps = {
  register: UseFormRegister<TProductosReventaSchema>;
  name: Path<TProductosReventaSchema>;
  typeInput: InputType;
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

export type PRLotesFormInputContainerProps = {
  inputType: string;
  title: string;
  name: Path<TLoteProductosReventaSchema>;
  register: UseFormRegister<TLoteProductosReventaSchema>;
  errors: FieldErrors<TLoteProductosReventaSchema>;
  optional?: boolean;
};

export type PRLotesFormInputProps = {
  register: UseFormRegister<TLoteProductosReventaSchema>;
  name: Path<TLoteProductosReventaSchema>;
  typeInput: string;
  placeholder?: string;
};

export type PRLotesFormSelectContainerProps = {
  title: string;
  name: Path<TLoteProductosReventaSchema>;
  register: UseFormRegister<TLoteProductosReventaSchema>;
  errors: FieldErrors<TLoteProductosReventaSchema>;
  children: ReactNode;
  optional?: boolean;
};

export type UnidadesDeMedida = {
  id: number;
  nombre_completo: string;
  abreviatura: string;
  tipo_medida?: string;
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
  unidad_base_inventario_nombre: string | null;
  fecha_creacion_registro: string;
  punto_reorden: number;
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
  precio_compra_usd: number;
  perecedero: boolean;
  fecha_creacion_registro: string;
  fecha_modificacion_registro: string;
  convert_inventory_to_sale_units: string;
  convert_sale_to_inventory_units: string;
  punto_reorden: number;
};

export type LotesProductosReventa = {
  id: number;
  producto_reventa: number;
  fecha_recepcion: string;
  fecha_caducidad: string;
  cantidad_recibida: number;
  stock_actual_lote: number;
  coste_unitario_lote_usd: number;
  detalle_oc: number | null;
  proveedor: { id: number; nombre_proveedor: string } | null;
  estado: string;
};

export type ProductosReventaPagination = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductosReventa[];
};

export type LoteProductoReventaPagination = {
  count: number;
  next: string | null;
  previous: string | null;
  results: LotesProductosReventa[];
};

