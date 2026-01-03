import { format, parseISO } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "../Common/DatePicker";
import type { SessionReport } from "../../types/types";

interface SalesFiltersProps {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    onDownload: () => void;
    isDownloading: boolean;
    salesData: SessionReport[] | undefined;
}

export const SalesFilters = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onDownload,
    isDownloading,
    salesData
}: SalesFiltersProps) => {

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date ? format(date, "yyyy-MM-dd") : "");
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date ? format(date, "yyyy-MM-dd") : "");
    };

    // Convert IS0 string (YYYY-MM-DD) to Date for the DatePicker
    // parseISO handles YYYY-MM-DD correctly as local midnight
    const start = startDate ? parseISO(startDate) : undefined;
    const end = endDate ? parseISO(endDate) : undefined;

    return (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <Label className="text-sm font-medium mb-1.5 block">
                        Fecha Inicio
                    </Label>
                    <DatePicker
                        date={start}
                        setDate={handleStartDateChange}
                        placeholder="Seleccionar inicio"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <Label className="text-sm font-medium mb-1.5 block">
                        Fecha Fin
                    </Label>
                    <DatePicker
                        date={end}
                        setDate={handleEndDateChange}
                        placeholder="Seleccionar fin"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="min-w-[100px]"
                >
                    Limpiar
                </Button>
                <Button
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="min-w-[160px] gap-2"
                >
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isDownloading ? "Generando..." : "Descargar PDF"}
                </Button>
            </div>
            {(startDate || endDate) && salesData && (
                <p className="mt-3 text-sm text-muted-foreground">
                    Mostrando {salesData.length} registros
                </p>
            )}
        </div>
    );
};
