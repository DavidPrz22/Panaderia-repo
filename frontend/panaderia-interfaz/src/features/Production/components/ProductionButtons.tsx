import Button from "@/components/Button";
import type { TProductionFormData } from "../schemas/schemas";
import type { UseFormHandleSubmit } from "react-hook-form";

export default function ProductionButtons({ onSubmit }: { onSubmit: UseFormHandleSubmit<TProductionFormData> }) {

  const handleSubmit = (data: TProductionFormData) => {
    
      console.log('uwuwuw')
      console.log(data);
  }

  return (
    <div className="flex items-center gap-4 justify-end mt-6">
      <Button type="cancel" onClick={() => console.log("Producción cancelada")}>
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={onSubmit(handleSubmit)}
      >
        Registrar Producción
      </Button>
    </div>
  );
}
