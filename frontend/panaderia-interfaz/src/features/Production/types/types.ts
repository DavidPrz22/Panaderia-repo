import type { UseFormWatch } from "react-hook-form";
import type { UseFormSetValue } from "react-hook-form";
import type { TProductionFormData } from "../schemas/schemas";

export type childrenProp = {
  children: React.ReactNode;
};

export type ProductionType = "producto-final" | "producto-intermedio";

export type searchItem = { id: number; nombre_producto: string };

export type RecetaComponenteProduccion = {
  id: number;
  nombre: string;
  unidad_medida: string;
  stock: number;
  cantidad: number;
};

export type ComponentesLista = RecetaComponenteProduccion[];


export type watchSetvalueTypeProduction = {
  watch?:  UseFormWatch<TProductionFormData>;
  setValue?: UseFormSetValue<TProductionFormData>;
}
