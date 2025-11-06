import { useState } from "react";
import type { Orden, Estados } from "../types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface OrderStatusDialogProps {
  order: Orden;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, newStatus: Estados) => void;
}

export const OrderStatusDialog = ({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<Estados>(
    order.estado_orden.nombre_estado as Estados,
  );

  const handleSubmit = () => {
    if (newStatus === order.estado_orden.nombre_estado) {
      toast.info("No se realizaron cambios");
      onOpenChange(false);
      return;
    }

    onStatusChange(order.id.toString(), newStatus);
    toast.success(`Estado cambiado a: ${newStatus}`);
    onOpenChange(false);
  };

  const getStatusDescription = (status: Estados): string => {
    const descriptions: Record<Estados, string> = {
      Pendiente: "La orden está esperando confirmación",
      "En Proceso": "Los productos están siendo preparados",
      Completado: "La orden ha sido completada",
      Cancelado: "La orden ha sido cancelada",
    };
    return descriptions[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Orden</DialogTitle>
          <DialogDescription>
            Orden: {order.id} - {order.cliente.nombre_cliente}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado Actual</Label>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {order.estado_orden.nombre_estado}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-status">Nuevo Estado</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as Estados)}
            >
              <SelectTrigger id="new-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="En Preparación">En Preparación</SelectItem>
                <SelectItem value="Listo para Entrega">
                  Listo para Entrega
                </SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getStatusDescription(newStatus)}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Confirmar Cambio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
