import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentTitle } from "./ProductionCompenentTitle";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";
import type { watchSetvalueTypeProduction } from "../types/types";
import { ProductionSubComponents } from "./ProductionSubComponents";
import { ChefHatIcon } from "@/assets/DashboardAssets";

export const ProductionComponents = ({ setValue, watch }: watchSetvalueTypeProduction) => {
  const {
    data: productionComponentes = [],
    isFetching,
    isFetched,
  } = useComponentsProductionQuery();

  const componentesProducts = "componentes" in productionComponentes ? productionComponentes.componentes : [];
  const subrecetasProducts = "subrecetas" in productionComponentes ? productionComponentes.subrecetas : [];

  return (
    <>
      {isFetching && <DoubleSpinnerLoading extraClassName="size-30 mt-4" />}

      {isFetched && componentesProducts.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentTitle />
          <div className="flex flex-col gap-2 mt-8">
            {componentesProducts.map((componente) => (
              <ProductionComponentItem
                key={componente.id}
                titulo={componente.nombre}
                stock={componente.stock}
                unidad={componente.unidad_medida}
                cantidad={componente.cantidad}
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
                    subrecetasProducts.map((subreceta, index) => (
                      <ProductionSubComponents key={index} subreceta={subreceta} />
                    ))
                  }
                </div>
              )
            }
          </div>
        </div>
      )}

      {isFetched && componentesProducts.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <div className="p-4 text-gray-800 font-bold">
            No hay componentes disponibles
          </div>
        </div>
      )}
    </>
  );
};
