import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
    estado: string;
}

export const StockBadge = ({ estado }: StockBadgeProps) => {
    if (estado === 'critico') {
        return <Badge variant="destructive">Crítico</Badge>;
    } else if (estado === 'bajo') {
        return <Badge className="bg-orange-500 hover:bg-orange-600">Bajo</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">OK</Badge>;
};
