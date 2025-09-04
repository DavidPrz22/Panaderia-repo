import type { watchSetvalueTypeProduction } from "../types/types";
import { ProductionRadioInput } from "./ProductionRadioInput";
import type { ProductionType } from "../types/types";

export const ProductionTypeContainer = ({setValue}: watchSetvalueTypeProduction) => {

  const handleOnChange = (value: ProductionType) => {
    if (setValue) setValue("tipoProducto", value);
  }

  return (
    <>
      <div className="text-lg font-semibold">Tipo de Producto</div>
      <div className="flex lg:flex-row flex-col items-center gap-4">
        <ProductionRadioInput
          tipo="producto-final"
          id="producto-final"
          label="Producto Final"
          onSelect={handleOnChange}
        />
        <ProductionRadioInput
          tipo="producto-intermedio"
          id="producto-intermedio"
          label="Producto Intermedio"
          onSelect={handleOnChange}
        />
      </div>
    </>
  );
};
