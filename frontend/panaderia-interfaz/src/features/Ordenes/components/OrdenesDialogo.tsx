import { useState } from "react";
import type { Order, OrdenesEstado } from "../types/types";
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
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, newStatus: OrdenesEstado) => void;
}

export const OrderStatusDialog = ({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<OrdenesEstado>(order.status);

  const handleSubmit = () => {
    if (newStatus === order.status) {
      toast.info("No se realizaron cambios");
      onOpenChange(false);
      return;
    }

    onStatusChange(order.id, newStatus);
    toast.success(`Estado cambiado a: ${newStatus}`);
    onOpenChange(false);
  };

  const getStatusDescription = (status: OrdenesEstado): string => {
    const descriptions: Record<OrdenesEstado, string> = {
      "Pendiente": "La orden está esperando confirmación",
      "Confirmado": "La orden ha sido confirmada y está lista para procesar",
      "En Preparación": "Los productos están siendo preparados",
      "Listo para Entrega": "La orden está lista para ser entregada al cliente",
      "Entregado": "La orden ha sido entregada al cliente",
      "Cancelado": "La orden ha sido cancelada",
    };
    return descriptions[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Orden</DialogTitle>
          <DialogDescription>
            Orden: {order.orderNumber} - {order.customer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado Actual</Label>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {order.status}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-status">Nuevo Estado</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrdenesEstado)}>
              <SelectTrigger id="new-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="En Preparación">En Preparación</SelectItem>
                <SelectItem value="Listo para Entrega">Listo para Entrega</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{getStatusDescription(newStatus)}</p>
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
