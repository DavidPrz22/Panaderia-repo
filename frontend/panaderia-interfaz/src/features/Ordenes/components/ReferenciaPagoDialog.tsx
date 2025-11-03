import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MetodoPago } from "../types/types";
import { useOrdenesContext } from "@/context/OrdenesContext";
interface ReferenciaPagoDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (ordenId: number, reference: string) => void;
  paymentMethod: MetodoPago;
}

export const ReferenciaPagoDialog = ({
  open,
  onClose,
  onConfirm,
  paymentMethod,
}: ReferenciaPagoDialogProps) => {
    const { ordenSeleccionadaId } = useOrdenesContext();
    const [reference, setReference] = useState("");

  const handleConfirm = () => {

    if (reference.trim()) {
      onConfirm(ordenSeleccionadaId!, reference);
      setReference("");
    }
  };

  const getLabel = () => {
    switch (paymentMethod.nombre_metodo) {
      case "Tarjeta":
        return "Últimos 4 dígitos / Autorización";
      case "Transferencia":
        return "Número de Referencia";
      default:
        return "Referencia de Pago";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="z-[var(--z-index-over-header-bar)]"
        overlayClassName="z-[var(--z-index-over-header-bar)]"
      >
        <DialogHeader>
          <DialogTitle>Confirmar Pago - {paymentMethod.nombre_metodo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reference">{getLabel()} *</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className=" focus-visible:ring-blue-200"
              placeholder={`Ingresa ${getLabel().toLowerCase()}`}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!reference.trim()} className="gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Confirmar Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
