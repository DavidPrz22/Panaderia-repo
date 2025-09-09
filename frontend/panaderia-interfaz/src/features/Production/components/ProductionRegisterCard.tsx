import { ProductionTypeContainer } from "./ProductionTypeContainer";
import { ProductionInputProduct } from "./ProductionInputProduct";
import { ProductionRegisterCardTitle } from "./ProductionRegisterCardTitle";
import { ProductDateInput } from "./ProductDateInput";
import { ProductionCantidad } from "./ProductionCantidad";
import type { watchSetvalueTypeProduction } from "../types/types";

export const ProductionRegisterCard = ({ watch, setValue }: watchSetvalueTypeProduction) => {
  return (
    <div className="flex flex-col gap-5 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <ProductionRegisterCardTitle />
      <ProductionTypeContainer setValue={setValue} />
      <div className="flex lg:flex-row flex-col items-center gap-2 ">

        <ProductionInputProduct title="Producto a Producir" setValue={setValue} />
        <ProductionCantidad setValue={setValue} watch={watch} />
        <div className="flex flex-1 flex-col gap-2 w-full">
          <div className="font-semibold font-[Roboto]">
            Fecha de Vencimiento
          </div>
          <ProductDateInput setValue={setValue} />
        </div>
      </div>
    </div>
  );
};
