import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentTitle } from "./ProductionCompenentTitle";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";
import type { ComponentesLista, componentesRecetaProducto, subreceta, watchSetvalueTypeProduction } from "../types/types";
import { ProductionSubComponents } from "./ProductionSubComponents";
import { ChefHatIcon } from "@/assets/DashboardAssets";
import { ProductionWarning } from "./ProductionWarning";
import { useProductionContext } from "@/context/ProductionContext";
import { useEffect, useMemo, memo } from "react";

type Componente = ComponentesLista[number];

const ProductionComponentsBase = ({ setValue, watch }: watchSetvalueTypeProduction) => {
  const {
  data,
    isFetching,
    isFetched,
  } = useComponentsProductionQuery();

  const { setInsufficientStock } = useProductionContext();

  const productionComponentes: componentesRecetaProducto | undefined = data as componentesRecetaProducto | undefined;

  const componentesPrincipalesProducts: Componente[] = useMemo(() => {
    return productionComponentes?.componentes ?? [];
  }, [productionComponentes]);

  const subrecetasProducts: subreceta[] = useMemo(() => {
    return productionComponentes?.subrecetas ?? [];
  }, [productionComponentes]);

  const componentesEnProducto: ComponentesLista = useMemo(() => {

    const all = [...componentesPrincipalesProducts];
    subrecetasProducts.forEach(({ componentes }) => {
        componentes.forEach((componente) => {
            const index = all.findIndex(c => c.id === componente.id);
            if (componente.id && index === -1) {
                all.push(componente);
            } else if (index !== -1) {
                const newComponent = { ...all[index] };
                newComponent.cantidad += componente.cantidad;
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
    setValue?.("componentes", componentesEnProducto);
  }, [isFetched, componentesEnProducto, setValue]);

  useEffect(() => {
    if (!isFetched) return;
    setInsufficientStock?.(insufficientStock);
  }, [isFetched, insufficientStock, setInsufficientStock]);

  return (
    <>
      {isFetching && <DoubleSpinnerLoading extraClassName="size-30 mt-4" />}

      {isFetched && componentesPrincipalesProducts.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentTitle />
          <ProductionWarning/>
          <div className="flex flex-col gap-2 mt-8">
  
            {componentesPrincipalesProducts.map((componente) => (
              <ProductionComponentItem
                key={componente.id}
                id={componente.id}
                titulo={componente.nombre}
                stock={componente.stock}
                unidad={componente.unidad_medida}
                cantidad={componente.cantidad}
                setValue={setValue}
                watch={watch}
              />
            ))}

            {
              subrecetasProducts.length > 0 && (
                <div className="space-y-4 border-t mt-5 pt-7 border-gray-200">
                  <div className="text-lg font-semibold flex gap-2">
                    <img src={ChefHatIcon} className="size-6" alt="" />
                    Recetas Relacionadas:
                  </div>
                  {
                    subrecetasProducts.map((sr, index) => (
                      <ProductionSubComponents key={`${sr.nombre}-${index}`} subreceta={sr} setValue={setValue} watch={watch} />
                    ))
                  }
                </div>
              )
            }
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
