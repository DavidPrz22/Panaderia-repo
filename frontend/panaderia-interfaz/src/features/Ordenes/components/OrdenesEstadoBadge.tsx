import { Badge } from "@/components/ui/badge";
import type { OrdenesEstado } from "../types/types";

interface OrdenesEstadoBadgeProps {
  status: OrdenesEstado;
}

export const OrdenesEstadoBadge = ({ status }: OrdenesEstadoBadgeProps) => {
  const variants: Record<OrdenesEstado, "default" | "secondary" | "destructive" | "outline"> = {
    "Pendiente": "outline",
    "Confirmado": "default",
    "En Preparación": "secondary",
    "Listo para Entrega": "default",
    "Entregado": "default",
    "Cancelado": "destructive",
  };

  const colors: Record<OrdenesEstado, string> = {
    "Pendiente": "border-orange-500 text-orange-500",
    "Confirmado": "bg-blue-500 text-white",
    "En Preparación": "bg-green-500 text-white",
    "Listo para Entrega": "bg-green-500 text-white",
    "Entregado": "bg-green-500 text-white",
    "Cancelado": "bg-red-500 text-white",
  };

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status}
    </Badge>
  );
};
