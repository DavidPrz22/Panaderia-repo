import type { ReactNode } from "react";
import type { TRecetasFormSchema } from "../schemas/schemas";
import type {
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type childrenType = {
  children: ReactNode;
};

export type RecetasFormSharedProps = {
  title: string;
  isUpdate?: boolean;
  initialData?: TRecetasFormSchema;
  onClose: () => void;
  onSubmitSuccess: () => void;
};

export type RecetasFormInputProps = {
  register?: UseFormRegister<TRecetasFormSchema>;
  name?: Path<TRecetasFormSchema>;
  typeInput: string;
  placeholder?: string;
};

export type RecetasFormSearchInputProps = {
  typeInput: string;
  placeholder?: string;
  onChange?: (search: string) => void;
};

export type RecetasFormInputContainerProps = {
  register?: UseFormRegister<TRecetasFormSchema>;
  title: string;
  name?: Path<TRecetasFormSchema>;
  errors: FieldErrors<TRecetasFormSchema>;
  inputType: string;
  optional?: boolean;
  componenteBusqueda?: boolean;
  recetaBusqueda?: boolean;
  onChange?: (search: string) => void;
  placeholder?: string;
};

export type itemRecetasSearchList = {
  id: number;
  nombre: string;
  tipo: "MateriaPrima" | "ProductoIntermedio";
};

export type RecetasSearchListContentProps = {
  category: string;
  items: itemRecetasSearchList[];
};

export type recetasSearchList = {
  [categoria: string]: itemRecetasSearchList[];
};

export type componenteListadosReceta = {
  id_componente: number;
  componente_tipo: "MateriaPrima" | "ProductoIntermedio";
  nombre: string;
};

export type componenteListadosRecetaProps = {
  id_componente: number;
  componente_tipo: "MateriaPrima" | "ProductoIntermedio";
  nombre: string;
};

export type recetasComponentListProps = {
  nombre: string;
  type: "MateriaPrima" | "ProductoIntermedio";
  id: number;
  last?: boolean;
};

export type watchSetValueProps = {
  watch: UseFormWatch<TRecetasFormSchema>;
  setValue: UseFormSetValue<TRecetasFormSchema>;
};

export type recetaItem = {
  id: number;
  nombre: string;
  fecha_creacion: string;
  fecha_modificacion: string | null;
  notas: string | null;
};

export type recetaDetallesItemComponente = {
  id: number;
  nombre: string;
  tipo: "Materia Prima" | "Producto Intermedio";
};

export type recetaDetallesItem = {
  receta: recetaItem;
  componentes: recetaDetallesItemComponente[];
};

export type recetaRelacionada = {
  id: number;
  nombre: string;
};

export type RecetaComponentsContainerProps = {
  watch: UseFormWatch<TRecetasFormSchema>;
  setValue: UseFormSetValue<TRecetasFormSchema>;
  errors: FieldErrors<TRecetasFormSchema>;
};

export type recetaListItemProps = {
  nombre: string;
  id: number;
  last?: boolean;
};