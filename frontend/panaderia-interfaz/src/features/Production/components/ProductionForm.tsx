import { ProductionRegisterCard } from "./ProductionRegisterCard";
import { ProductionComponents } from "./ProductionComponents";
import { useForm } from "react-hook-form";
import { productionSchema, type TProductionFormData } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductionButtons from "./ProductionButtons";

export const ProductionForm = () => {
  const { watch, setValue, handleSubmit } = useForm<TProductionFormData>({
    resolver: zodResolver(productionSchema),
  });

  return (
    <>
      <ProductionRegisterCard setValue={setValue} watch={watch} />
      <ProductionComponents
        setValue={setValue}
        watch={watch}
        cantidadProduction={watch("cantidadProduction")}
      />
      <ProductionButtons onSubmit={handleSubmit} />
    </>
  );
};
