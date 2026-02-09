import Button from "@/components/Button";
import type { TProductionFormData } from "../schemas/schemas";
import type { UseFormHandleSubmit } from "react-hook-form";
import { useCreateProductionMutation } from "../hooks/mutations/mutations";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";
import { useProductionContext } from "@/context/ProductionContext";
import { toast } from 'sonner';

export default function ProductionButtons({
  onSubmit,
  resetProduction,
}: {
  onSubmit: UseFormHandleSubmit<TProductionFormData>;
  resetProduction: () => void;
}) {
  const { mutate: createProduction, isPending: isCreateProductionPending } = useCreateProductionMutation();
  const { medidaFisica, esPorUnidad, insufficientStock } = useProductionContext();

  const handleChecks = () => {
    if (insufficientStock && insufficientStock.length > 0) {
      toast.error("No se puede registrar la producción con componentes con stock insuficiente");
      return;
    }

    onSubmit(handleSubmit, (errors) => {
      if (errors.cantidadProduction) {
        toast.error(errors.cantidadProduction.message);
      }
      if (errors.fechaExpiracion) {
        toast.error(errors.fechaExpiracion.message);
      }
    })();
  }

  const handleSubmit = (data: TProductionFormData) => {
    if (medidaFisica === "PESO" && !esPorUnidad) {
      data.peso = data.cantidadProduction;
    }

    if (medidaFisica === "VOLUMEN" && !esPorUnidad) {
      data.volumen = data.cantidadProduction;
    }
    createProduction(data, {
      onSuccess: () => {
        toast.success("Producción registrada exitosamente");
      },
      onError: () => {
        toast.error("Error al registrar la producción");
      },
    });
  };

  return (
    <div className="flex items-center gap-4 justify-end mt-6">
      <Button type="cancel" onClick={resetProduction}>
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={handleChecks}
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
    </div>
  );
}
