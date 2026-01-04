import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockBadge } from "../Common/StockBadge";
import type { InventoryItem } from "../../types/types";

interface InventoryTableProps {
    items: InventoryItem[] | undefined;
    showPrice?: boolean;
    isLoading: boolean;
}

export const InventoryTable = ({ items, showPrice = false, isLoading }: InventoryTableProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <Table>
            <TableHeader className="bg-blue-50">
                <TableRow>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Unidad</TableHead>
                    <TableHead className="text-right font-semibold">Stock</TableHead>
                    <TableHead className="text-right font-semibold">Stock Mín.</TableHead>
                    <TableHead className="text-right font-semibold">Lotes Disponibles</TableHead>
                    {showPrice && <TableHead className="text-right font-semibold">Precio</TableHead>}
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Última Actualización</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nombre}</TableCell>
                        <TableCell>{item.unidad_medida}</TableCell>
                        <TableCell className="text-right">{item.stock_actual.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.punto_reorden.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.lotes_disponibles === 0 ? 'Ninguno' : item.lotes_disponibles}</TableCell>
                        {showPrice && item.precio_venta_usd !== null && item.precio_venta_usd !== undefined && (
                            <TableCell className="text-right">${item.precio_venta_usd.toFixed(2)}</TableCell>
                        )}
                        {showPrice && (item.precio_venta_usd === null || item.precio_venta_usd === undefined) && (
                            <TableCell className="text-right">-</TableCell>
                        )}
                        <TableCell><StockBadge estado={item.estado} /></TableCell>
                        <TableCell className="text-muted-foreground">
                            {item.fecha_ultima_actualizacion
                                ? format(new Date(item.fecha_ultima_actualizacion), 'dd/MM/yyyy', { locale: es })
                                : '-'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
