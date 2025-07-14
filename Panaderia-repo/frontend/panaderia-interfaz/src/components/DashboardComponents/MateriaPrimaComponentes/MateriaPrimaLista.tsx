import { TableBody } from "@/components/TableBody";
import { TableHeader } from "@/components/TableHeader";
import FilterSearch from "@/components/DashboardComponents/FilterSearch";
import { useAppContext } from "@/context/AppContext";

export default function MateriaPrimaLista() {
    const {showMateriaprimaForm, showMateriaprimaDetalles} = useAppContext();

    if (showMateriaprimaForm || showMateriaprimaDetalles) return <></>;

    return (
        <>
            <FilterSearch />
            <TableHeader headers={["Id", "Nombre", "Unidad de medida", "Categoria", "Cantidad", "Punto de reorden", "Fecha de creación"]} />
            <TableBody />
        </>
    )
}