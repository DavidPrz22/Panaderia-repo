import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentTitle } from "./ProductionCompenentTitle";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";
import type { watchSetvalueTypeProduction } from "../types/types";
import { ProductionSubComponents } from "./ProductionSubComponents";

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
        <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentTitle />
          <div className="flex flex-col gap-2 mt-4">
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
                <div className="space-y-4 mt-4">
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
