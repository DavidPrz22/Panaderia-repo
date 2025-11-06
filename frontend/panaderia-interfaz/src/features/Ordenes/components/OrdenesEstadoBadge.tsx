import { Badge } from "@/components/ui/badge";
import type { Estados } from "../types/types";

interface OrdenesEstadoBadgeProps {
  estadoOrden: Estados;
}

export const OrdenesEstadoBadge = ({
  estadoOrden,
}: OrdenesEstadoBadgeProps) => {
  const variants: Record<
    Estados,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Pendiente: "outline",
    "En Proceso": "secondary",
    Completado: "default",
    Cancelado: "destructive",
  };

  const colors: Record<Estados, string> = {
    Pendiente: "border-orange-500 text-orange-500",
    "En Proceso": "bg-blue-500 text-white",
    Completado: "bg-green-500 text-white",
    Cancelado: "bg-red-500 text-white",
  };

  return (
    <Badge variant={variants[estadoOrden]} className={colors[estadoOrden]}>
      {estadoOrden}
    </Badge>
  );
};
