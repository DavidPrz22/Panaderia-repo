import { ProductionRegisterCard } from "./ProductionRegisterCard";
import { ProductionComponents } from "./ProductionComponents";
import { useForm } from "react-hook-form";
import { productionSchema, type TProductionFormData } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductionButtons from "./ProductionButtons";
import { ProductionNewComponentModal } from "@/features/Production/components/ProductionNewComponentModal";
import { Toast } from "@/components/Toast";
import { useProductionContext } from "@/context/ProductionContext";

export const ProductionForm = () => {
  const { watch, setValue, handleSubmit } = useForm<TProductionFormData>({
    resolver: zodResolver(productionSchema),
  });

  const { showToast, setShowToast, toastMessage } = useProductionContext();

  return (
    <>
      <ProductionRegisterCard setValue={setValue} watch={watch} />
      <ProductionComponents
        setValue={setValue}
        watch={watch}
        cantidadProduction={watch("cantidadProduction")}
      />
      <ProductionButtons onSubmit={handleSubmit} />
      <ProductionNewComponentModal setValue={setValue} watch={watch} />
      <Toast
        open={showToast}
        message={toastMessage}
        severity="success"
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
