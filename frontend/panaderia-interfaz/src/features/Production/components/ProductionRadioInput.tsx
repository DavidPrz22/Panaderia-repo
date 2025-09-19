import { useProductionContext } from "@/context/ProductionContext";
import type { ProductionType } from "../types/types";
export const ProductionRadioInput = ({
  tipo,
  id,
  label,
  onSelect,
}: {
  tipo: ProductionType;
  id: string;
  label: string;
  onSelect: (value: ProductionType) => void;
}) => {
  const { productType, setProductType } = useProductionContext();

  const handleOnChange = (value: ProductionType) => {
    setProductType(value);
    onSelect(value);
  };

  return (
    <label
      className="flex lg:w-fit w-full items-center gap-2 cursor-pointer"
      htmlFor={id}
    >
      <input
        type="radio"
        name={tipo}
        id={id}
        className="size-4"
        checked={productType === tipo}
        onChange={() => handleOnChange(tipo)}
      />
      {label}
    </label>
  );
};
