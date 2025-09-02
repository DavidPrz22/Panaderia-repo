import { useProductionContext } from "@/context/ProductionContext";
import type { ProductionType } from "../types/types";
export const ProductionRadioInput = ({
  name,
  id,
  label,
}: {
  name: ProductionType;
  id: string;
  label: string;
}) => {

    const { productType, setProductType } = useProductionContext();

    return (
    <label
        className="flex lg:w-fit w-full items-center gap-2 cursor-pointer"
        htmlFor={id}
    >
        <input
            type="radio"
            name={name}
            id={id}
            className="size-4"
            checked={productType === name}
            onChange={() => setProductType(name)}   
        />
        {label}
    </label>
  );
};
