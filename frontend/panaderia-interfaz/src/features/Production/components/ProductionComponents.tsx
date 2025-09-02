import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentTitle } from "./ProductionCompenentTitle";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";


export const ProductionComponents = () => {

  const { data: productionComponentes = [] , isFetching, isFetched } = useComponentsProductionQuery();

  return (
    <>
      {isFetching && <DoubleSpinnerLoading extraClassName="size-30 mt-4"/>}

      {productionComponentes.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentTitle />
          <div className="flex flex-col gap-2 mt-4">
            {productionComponentes.map((componente) => (
            <ProductionComponentItem
              key={componente.id}
              title={componente.nombre}
              stock={componente.stock}
              unit={componente.unidad_medida}
            />
          ))}
        </div>
      </div>
    )}

    {isFetched && productionComponentes.length === 0 && (
      <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
        <div className="p-4 text-gray-800 font-bold">No hay componentes disponibles</div>
      </div>
    )}
    </>
  );
};
