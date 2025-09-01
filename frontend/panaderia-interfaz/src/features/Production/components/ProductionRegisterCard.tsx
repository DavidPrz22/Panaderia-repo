import { ProductionTypeContainer } from "./ProductionTypeContainer";
import { ProductionInputProduct } from "./ProductionInputProduct";
import { ProductionRegisterCardTitle } from "./ProductionRegisterCardTitle";
import { ProductDateInput } from "./ProductDateInput";

export const ProductionRegisterCard = () => {
  return (
    <div className="flex flex-col gap-5 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <ProductionRegisterCardTitle />
      <ProductionTypeContainer />
      <div className="flex lg:flex-row flex-col items-center gap-2 ">
        <ProductionInputProduct title="Producto a Producir" />
        <div className="flex flex-1 flex-col gap-2 w-full">
          <div className="font-semibold font-[Roboto]">Cantidad a Producir</div>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                type="number"
                className="px-2 py-[0.95rem] w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-[box-shadow] duration-300"
                min={0}
                step={0.1}
                placeholder="Cantidad a producir..."
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 w-full">
          <div className="font-semibold font-[Roboto]">
            Fecha de Vencimiento
          </div>
          <ProductDateInput />
        </div>
      </div>
    </div>
  );
};
