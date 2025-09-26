import Button from "@/components/Button";
import type { TProductionFormData } from "../schemas/schemas";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useCreateProductionMutation } from "../hooks/mutations/mutations";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";
import { Toast } from "@/components/Toast";
import { useProductionContext } from "@/context/ProductionContext";
export default function ProductionButtons({
  onSubmit,
  resetProduction,
}: {
  onSubmit: UseFormHandleSubmit<TProductionFormData>;
  resetProduction: () => void;
}) {
  const { mutate: createProduction, isPending: isCreateProductionPending } = useCreateProductionMutation();
  const { medidaFisica, esPorUnidad, showToast, setShowToast, toastMessage, insufficientStock } = useProductionContext();
  
  const handleSubmit = (data: TProductionFormData) => {
    // Prevent submission if there are components with insufficient stock
    if (insufficientStock && insufficientStock.length > 0) {
      console.warn("Cannot submit: components with insufficient stock", insufficientStock);
      return;
    }
    if (medidaFisica === "PESO" && !esPorUnidad) {
      data.peso = data.cantidadProduction;
    }

    if (medidaFisica === "VOLUMEN" && !esPorUnidad) {
      data.volumen = data.cantidadProduction;
    }
    createProduction(data);
  };

  return (
    <div className="flex items-center gap-4 justify-end mt-6">
      <Button type="cancel" onClick={resetProduction}>
        Cancelar
      </Button>
      <Button 
        type="submit" 
        onClick={onSubmit(handleSubmit)}
        disabled={Boolean(insufficientStock && insufficientStock.length > 0)}
      >
        {isCreateProductionPending ? (
          <div className="flex items-center gap-2">
            <span>Registrando Producción...</span>
            <PendingTubeSpinner size={6} white={true} />
          </div>
        ) : (
          "Registrar Producción"
        )}
      </Button>
      <Toast
        open={showToast}
        message={toastMessage}
        severity="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
