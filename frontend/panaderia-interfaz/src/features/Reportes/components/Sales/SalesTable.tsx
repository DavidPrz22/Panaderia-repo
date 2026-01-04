import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { SessionReport } from "../../types/types";

interface SalesTableProps {
    data: SessionReport[] | undefined;
    isLoading: boolean;
    onSessionClick: (sessionId: number) => void;
}

export const SalesTable = ({ data, isLoading, onSessionClick }: SalesTableProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-blue-100">
                    <TableHead className="font-semibold">Fecha</TableHead>
                    <TableHead className="font-semibold">Horario</TableHead>
                    <TableHead className="font-semibold">Cajero</TableHead>
                    <TableHead className="text-right font-semibold">Efectivo Inicial</TableHead>
                    <TableHead className="text-right font-semibold">Ventas Efectivo</TableHead>
                    <TableHead className="text-right font-semibold">Ventas Tarjeta</TableHead>
                    <TableHead className="text-right font-semibold">Total Ventas</TableHead>
                    <TableHead className="text-right font-semibold">Transacciones</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((session) => (
                    <TableRow
                        key={session.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSessionClick(session.id)}
                    >
                        <TableCell className="font-medium">
                            {format(new Date(session.fecha_apertura), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell>
                            {format(new Date(session.fecha_apertura), 'HH:mm', { locale: es })}
                            {session.fecha_cierre && ` - ${format(new Date(session.fecha_cierre), 'HH:mm', { locale: es })}`}
                        </TableCell>
                        <TableCell>{session.cajero_nombre}</TableCell>
                        <TableCell className="text-right">Bs. {session.monto_inicial_ves?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right">Bs. {session.total_efectivo_ves?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right">Bs. {session.total_tarjeta_ves?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right font-semibold">Bs. {session.total_ventas_ves?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right">{session.numero_transacciones}</TableCell>
                        <TableCell>
                            {session.esta_activa && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                    Activa
                                </Badge>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
