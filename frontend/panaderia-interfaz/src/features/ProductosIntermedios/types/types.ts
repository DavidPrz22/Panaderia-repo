import type { ReactNode } from "react";
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { TProductosIntermediosSchema } from "../schemas/schema";

export type childrenProp = {
  children: ReactNode;
};

export type ProductosIntermediosFormSharedProps = {
  title: string;
  isUpdate?: boolean;
  initialData?: ProductosIntermediosDetalles;
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
  initialData?: RecetaRelacionada | false;
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
};

export type UnidadesDeMedida = {
  id: number;
  nombre_completo: string;
  abreviatura: string;
  tipo_medida?: string;
};

export type CategoriaProductoIntermedio = {
  id: number;
  nombre_categoria: string;
};

export type setValueProps = {
  setValue?: UseFormSetValue<TProductosIntermediosSchema>;
};

export type ProductosIntermedios = {
  id: number;
  nombre_producto: string;
  SKU: string;
  stock_actual: number;
  punto_reorden: number;
  categoria_nombre: string;
  unidad_produccion_producto: string;
  fecha_creacion_registro: string;
};

export type RecetaRelacionada =
  | {
      id: number;
      nombre: string;
    }
  | false;

export type ProductosIntermediosDetalles = {
  id: number;
  nombre_producto: string;
  SKU: string;
  stock_actual: number;
  punto_reorden: number;
  categoria_producto: { id: number; nombre_categoria: string };
  unidad_produccion_producto: { id: number; nombre_completo: string };
  fecha_creacion_registro: string;
  fecha_modificacion_registro: string;
  descripcion: string;
  receta_relacionada: RecetaRelacionada;
  tipo_medida_fisica: "UNIDAD" | "PESO" | "VOLUMEN";
};

export type LotesProductosIntermedios = {
  id: number;
  fecha_produccion: string;
  fecha_caducidad: string;
  cantidad_inicial_lote: string;
  stock_actual_lote: string;
  coste_total_lote_usd: string;
  estado: "DISPONIBLE" | "INACTIVO" | "EXPIRADO" | "AGOTADO";
  produccion_origen: number;
  peso_total_lote_gramos: string | null;
  volumen_total_lote_ml: string | null;
  peso_promedio_por_unidad: number | null;
  volumen_promedio_por_unidad: number | null;
  costo_unitario_usd: number;
};
