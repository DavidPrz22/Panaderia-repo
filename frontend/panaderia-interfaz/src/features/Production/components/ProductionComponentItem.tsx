import type { watchSetvalueTypeProduction } from "../types/types";
import { ProductionComponentItemCantidad } from "./ProductionComponentItemCantidad";

type itemProps = {
  id: number;
  titulo: string;
  stock: number;
  unidad: string;
  cantidad: number;
};

export const ProductionComponentItem = ({
  id,
  titulo,
  stock,
  unidad,
  cantidad,
  watch,
  setValue
}: itemProps & watchSetvalueTypeProduction) => {

  return (
    <div className="flex lg:flex-row flex-col lg:items-center justify-between px-10 py-3 border border-gray-200 rounded-lg gap-2 bg-white font-[Roboto]">
      <div className="space-y-1">
        <h2 className="flex gap-2 text-lg font-semibold">
          {titulo}
          <span className=" bg-gray-200 text-sm px-2 py-0.5 rounded-sm font-semibold">
            {unidad}
          </span>
        </h2>
        <p className="text-gray-600 text-md">
          Stock disponible: {stock} {unidad}
        </p>
      </div>
    
      <ProductionComponentItemCantidad
        id={id}
        stock={stock}
        unidad={unidad}
        cantidad={cantidad}
        nombre={titulo}
        setValue={setValue}
        watch={watch}
      />
  
    </div>
  );
};
