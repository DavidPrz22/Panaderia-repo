import { LotesTableHeader } from "./LotesTableHeader";
import { LotesTableRows } from "./LotesTableRows";
import type { LoteMateriaPrimaFormResponse, LoteMateriaPrima } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";


export const LotesTable = ({ lotes }: { lotes: LoteMateriaPrimaFormResponse[] }) => {

    const { lotesForm, 
        setLotesMateriaPrimaDetalles,
        setShowLotesMateriaPrimaDetalles,
        setShowLotesForm
    } = useAppContext();

    const formatedLotes: LoteMateriaPrima[] = lotes.map((lote) => ({
        id: lote.id!,
        fecha_recepcion: new Date(lote.fecha_recepcion).toLocaleDateString('es-ES'),
        fecha_caducidad: new Date(lote.fecha_caducidad).toLocaleDateString('es-ES'),
        cantidad_recibida: lote.cantidad_recibida,
        stock_actual_lote: lote.stock_actual_lote,
        costo_unitario_usd: lote.costo_unitario_usd,
        proveedor: lote.proveedor?.nombre_comercial || '-',
        activo: lote.activo || false
    }));

    const handleClick = (id: number) => {
        const lote = lotesForm.find((lote) => lote.id === id);
        if (lote) {
            setLotesMateriaPrimaDetalles(lote);
            setShowLotesMateriaPrimaDetalles(true);
            setShowLotesForm(false);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <LotesTableHeader headers={["Fecha de recepción", "Fecha de caducidad", "Cantidad recibida", "Stock actual", "Costo unitario USD", "Proveedor", "Activo"]} />
            <LotesTableRows data={formatedLotes} onClick={handleClick}/>
        </div>
    )
}