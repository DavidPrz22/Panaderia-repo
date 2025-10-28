import { Badge } from "@/components/ui/badge";
import type { EstadosOC } from "../types/types";

interface OrdenesEstadoBadgeProps {
  estadoCompras: EstadosOC;
}

export const OrdenesEstadoBadge = ({ estadoCompras }: OrdenesEstadoBadgeProps) => {
  const variants: Record<EstadosOC, "default" | "secondary" | "destructive" | "outline"> = {
    "Borrador": "outline",
    "Enviada": "secondary",
    "Recibida Parcial": "default",
    "Recibida Completa": "default",
    "Cancelada": "destructive",
  };

  const colors: Record<EstadosOC, string> = {
    "Borrador": "border-orange-500 text-orange-500",
    "Enviada": "bg-blue-500 text-white",
    "Recibida Parcial": "bg-green-500 text-white",
    "Recibida Completa": "bg-green-500 text-white",
    "Cancelada": "bg-red-500 text-white",
  };

  return (
    <Badge variant={variants[estadoCompras]} className={colors[estadoCompras]}>
      {estadoCompras}
    </Badge>
  );
};
