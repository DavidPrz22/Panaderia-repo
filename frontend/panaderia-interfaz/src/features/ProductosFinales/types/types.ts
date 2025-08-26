import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { TProductoFinalSchema } from "../schemas/schemas";

export type ProductoFinal = {
  id: number;
  nombre_producto: string;
  SKU: string;
  unidad_venta: string;
  precio: number;
  stock_actual: string;
  punto_reorden: number;
  categoria: string;
};

export type ProductosFinalesList = ProductoFinal[];

export type receta_relacionada = {
  id: number;
  nombre: string;
} | false;

export type ProductoFinalDetalles = { 
  id: number;
  nombre_producto: string;
  SKU: string;
  precio_venta_usd: number | null;
  stock_actual: number;
  punto_reorden: number;
  categoria: { id: number; nombre_categoria: string };
  unidad_medida: { id: number; nombre_medida: string };
  tipo_manejo_venta: 'UNIDAD' | 'Unidad' | 'PESO_VOLUMEN' | 'Peso_Volumen';
  descripcion: string;
  fecha_creacion_registro: string;
  fecha_modificacion_registro: string;
  receta_relacionada: receta_relacionada | null;
}

export type PFFormInputContainerProps = {
  inputType: string;
  title: string;
  name: Path<TProductoFinalSchema>;
  register: UseFormRegister<TProductoFinalSchema>;
  errors: FieldErrors;
  optional?: boolean;
  search?: boolean;
  initialData?: receta_relacionada;
}

export type setValueProps = {
  setValue?: UseFormSetValue<TProductoFinalSchema>;
};

export type ProductosFinalesFormSharedProps = {
  title: string;
  isUpdate?: boolean;
  initialData?: ProductoFinalDetalles;
  onClose: () => void;
  onSubmitSuccess: () => void;
};

export type PFFormSelectContainerProps = {
  title: string;
  name: Path<TProductoFinalSchema>;
  register: UseFormRegister<TProductoFinalSchema>;
  errors: FieldErrors;
  optional?: boolean;
  children: React.ReactNode;
}

export type CategoriaProductoFinal = {
  id: number;
  nombre_categoria: string;
};

export type UnidadesDeMedida = { 
  id: number;
  nombre_medida: string;
}

export type recetasSearchItem = {
  id: number;
  nombre: string;
}

export type PFFormInputProps = {
  typeInput: string;
  name: Path<TProductoFinalSchema>;
  placeholder?: string;
  register: UseFormRegister<TProductoFinalSchema>;
}