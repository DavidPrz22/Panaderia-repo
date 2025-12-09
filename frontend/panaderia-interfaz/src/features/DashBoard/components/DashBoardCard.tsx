import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCartIcon,
  AlertTriangleIcon,
  FactoryIcon,
} from "lucide-react";

const TYPES = {
  VENTAS: "Ventas",
  PEDIDOS: "Pedidos Pendientes",
  ALERTAS: "Alertas",
  PRODUCCION: "Producción",
};

type CardProps = {
  type: "Ventas" | "Pedidos Pendientes" | "Alertas" | "Producción";
  value: string;
  smallText: string;
  boldedText?: string;
};

export const DashBoardCard = ({
  type,
  value,
  smallText,
  boldedText,
}: CardProps) => {
  const handleTypeIcon = () => {
    switch (type) {
      case TYPES.VENTAS:
        return (
          <DollarSign className="w-8 h-8 p-1.5 bg-green-300 text-green-600 rounded-md" />
        );
      case TYPES.PEDIDOS:
        return (
          <ShoppingCartIcon className="w-8 h-8 p-1.5 bg-blue-300 text-blue-600 rounded-md" />
        );
      case TYPES.ALERTAS:
        return (
          <AlertTriangleIcon className="w-8 h-8 p-1.5 bg-red-300 text-red-600 rounded-md" />
        );
      case TYPES.PRODUCCION:
        return (
          <FactoryIcon className="w-8 h-8 p-1.5 bg-amber-300 text-amber-600 rounded-md" />
        );
    }
  };

  const handleHeaderText = () => {
    switch (type) {
      case TYPES.VENTAS:
        return "Ventas del Día";
      case "Pedidos Pendientes":
        return "Pedidos Pendientes";
      case "Alertas":
        return "Alertas de Inventario";
      case "Producción":
        return "Producción Reciente";
    }
  };

  const formatBoldedText = () => {
    if (type === TYPES.VENTAS || type === TYPES.PRODUCCION)
      return (
        <div className="text-green-600 text-sm font-semibold">{boldedText}</div>
      );

    if (type === TYPES.ALERTAS)
      return (
        <div className="text-red-600 text-sm font-semibold">{boldedText}</div>
      );

    if (type === TYPES.PEDIDOS)
      return (
        <div className="text-blue-600 text-sm font-semibold">{boldedText}</div>
      );
  };
  return (
    <Card className="shadow-none flex-1 hover:shadow-sm border-gray-300">
      <CardContent>
        <div className="flex justify-between font-[Roboto]">
          <div className="space-y-2">
            <div className="text-sm text-gray-700">{handleHeaderText()}</div>
            <div className="font-bold text-lg">{value}</div>
          </div>
          {handleTypeIcon()}
        </div>
        <div className="space-y-1 mt-1">
          <div className="text-xs text-gray-500">{smallText}</div>
          {boldedText && formatBoldedText()}
        </div>
      </CardContent>
    </Card>
  );
};
