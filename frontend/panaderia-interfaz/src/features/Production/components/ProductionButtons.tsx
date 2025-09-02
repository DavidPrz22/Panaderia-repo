import Button from "@/components/Button";

export default function ProductionButtons() {
  return (
    <div className="flex items-center gap-4 justify-end mt-6">
      <Button type="cancel" onClick={() => console.log("Producción cancelada")}>
        Cancelar
      </Button>
      <Button
        disabled={true}
        type="submit"
        onClick={() => console.log("Producción registrada")}
      >
        Registrar Producción
      </Button>
    </div>
  );
}
