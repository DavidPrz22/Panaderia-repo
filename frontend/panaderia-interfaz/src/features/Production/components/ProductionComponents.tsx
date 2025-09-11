import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentsHeader } from "./ProductionComponentsHeader";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";
import type {
  ComponentesLista,
  componentesRecetaProducto,
  subreceta,
  watchSetvalueTypeProduction,
} from "../types/types";
import { ProductionSubComponents } from "./ProductionSubComponents";
import { ChefHatIcon } from "@/assets/DashboardAssets";
import { ProductionWarning } from "./ProductionWarning";
import { useProductionContext } from "@/context/ProductionContext";
import { useEffect, useMemo, memo } from "react";

type Componente = ComponentesLista[number];

const ProductionComponentsBase = ({
  setValue,
  watch,
  cantidadProduction,
}: watchSetvalueTypeProduction & { cantidadProduction?: number }) => {
  const { data, isFetching, isFetched } = useComponentsProductionQuery();

  const { setInsufficientStock } = useProductionContext();

  const productionComponentes: componentesRecetaProducto | undefined = data as
    | componentesRecetaProducto
    | undefined;

  // Cantidad a producir desde el formulario (0 por defecto)
  const cantidad = cantidadProduction ?? 0;

  // Escalar cantidades de componentes base por la cantidad a producir
  const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;
  const componentesPrincipalesProducts: Componente[] = useMemo(() => {
    const base = productionComponentes?.componentes ?? [];
    const q = Number(cantidad) || 0;
    return base.map((c) => ({
      ...c,
      cantidad: roundTo3((c.cantidad ?? 0) * q),
    }));
  }, [productionComponentes, cantidad]);

  // Escalar cantidades de subrecetas por la cantidad a producir
  const subrecetasProducts: subreceta[] = useMemo(() => {
    const subs = productionComponentes?.subrecetas ?? [];
    const q = Number(cantidad) || 0;
    return subs.map((sr) => ({
      ...sr,
      componentes: sr.componentes.map((c) => ({
        ...c,
        cantidad: roundTo3((c.cantidad ?? 0) * q),
      })),
    }));
  }, [productionComponentes, cantidad]);

  // Unificar y sumar por componente (base + subrecetas) con cantidades escaladas
  const componentesEnProducto: ComponentesLista = useMemo(() => {
    const all: ComponentesLista = [
      ...componentesPrincipalesProducts.map((c) => ({ ...c })),
    ];
    subrecetasProducts.forEach(({ componentes }) => {
      componentes.forEach((componente) => {
        const index = all.findIndex((c) => c.id === componente.id);
        if (componente.id && index === -1) {
          all.push({ ...componente });
        } else if (index !== -1) {
          const newComponent = { ...all[index] };
          newComponent.cantidad = roundTo3(
            newComponent.cantidad + componente.cantidad,
          );
          all[index] = newComponent;
        }
      });
    });
    return all;
  }, [componentesPrincipalesProducts, subrecetasProducts]);

  const insufficientStock: ComponentesLista = useMemo(() => {
    return componentesEnProducto.filter((c) => c.stock < c.cantidad);
  }, [componentesEnProducto]);

  useEffect(() => {
    if (!isFetched) return;
    // Guardar en el formulario solo lo necesario para el backend/zod: id y cantidad
    const formComponentes = componentesEnProducto.map(({ id, cantidad }) => ({
      id,
      cantidad: roundTo3(cantidad),
    }));
    setValue?.("componentes", formComponentes, { shouldValidate: true });
  }, [isFetched, componentesEnProducto, setValue]);

  // Al cargar componentes del servidor, si no hay cantidad indicada por el usuario,
  // establecer 1 para mostrar cantidades base de la receta
  useEffect(() => {
    if (!isFetched) return;
    const current = cantidad;
    if (!current || current <= 0) {
      const input = document.getElementById("cantidadProduction");
      console.log(input);
      if (input) (input as HTMLInputElement).value = "1";
      setValue?.("cantidadProduction", 1, { shouldValidate: true });
    }
  }, [isFetched, setValue, watch, productionComponentes, cantidad]);

  useEffect(() => {
    if (!isFetched) return;
    setInsufficientStock?.(insufficientStock);
  }, [isFetched, insufficientStock, setInsufficientStock]);

  return (
    <>
      {isFetching && <DoubleSpinnerLoading extraClassName="size-30 mt-4" />}

      {isFetched && componentesPrincipalesProducts.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentsHeader />
          <ProductionWarning />
          <div className="flex flex-col gap-2 mt-8">
            {componentesPrincipalesProducts.map((componente) => (
              <ProductionComponentItem
                key={`${componente.id}-${componente.cantidad}`}
                id={componente.id}
                titulo={componente.nombre}
                stock={componente.stock}
                unidad={componente.unidad_medida}
                cantidad={componente.cantidad}
                setValue={setValue}
                watch={watch}
              />
            ))}

            {subrecetasProducts.length > 0 && (
              <div className="space-y-4 border-t mt-5 pt-7 border-gray-200">
                <div className="text-lg font-semibold flex gap-2">
                  <img src={ChefHatIcon} className="size-6" alt="" />
                  Recetas Relacionadas:
                </div>
                {subrecetasProducts.map((sr, index) => (
                  <ProductionSubComponents
                    key={`${sr.nombre}-${index}-${cantidad}`}
                    subreceta={sr}
                    setValue={setValue}
                    watch={watch}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isFetched && componentesPrincipalesProducts.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <div className="p-4 text-gray-800 font-bold">
            No hay componentes disponibles
          </div>
        </div>
      )}
    </>
  );
};

export const ProductionComponents = memo(ProductionComponentsBase);
ProductionComponents.displayName = "ProductionComponents";
