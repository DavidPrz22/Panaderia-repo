import { TableRows } from "./TableRows";
import { useEffect, useState } from "react";
import { handleMateriaPrimaList, handleMateriaPrimaPK } from "@/lib/utils";
import type { MateriaPrimaList, MateriaPrimaListServer } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";

export const TableBody = () => {
    const { 
        listaMateriaPrimaCached, 
        setListaMateriaPrimaCached,
        listaMateriaPrimaFiltered,
        filteredApplied,
        listaMateriaPrimaFilteredInputSearch,
        MPFilteredInputSearchApplied,
        setShowMateriaprimaDetalles,
        setMateriaprimaDetalles,
        setMateriaprimaId,
        setLotesForm,
        inputfilterDoubleApplied,
    } = useAppContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response = await handleMateriaPrimaList();
            
            const cleanedData: MateriaPrimaList[] = response.map((item: MateriaPrimaListServer) => ({
                id: item.id,
                name: item.nombre,
                unit: item.unidad_medida_base_detail.nombre_completo,
                category: item.categoria_detail.nombre_categoria,
                quantity: item.stock_actual,
                reorderPoint: item.punto_reorden,
                creationDate: item.fecha_creacion_registro,
            }));
            setListaMateriaPrimaCached(cleanedData);
            setIsLoading(false);
        };
        
        fetchData();
    }, [setListaMateriaPrimaCached]);

    const detallesMateriaPrimaPK = async (pk: number) => {
        const data = await handleMateriaPrimaPK(pk);

        if (Array.isArray(data) && data.length > 0) {
            const detailData = data.find((item: MateriaPrimaListServer) => item.id === pk);
            setShowMateriaprimaDetalles(true);
            setMateriaprimaDetalles(detailData);
            setMateriaprimaId(pk);
            setLotesForm([]);
        } else {
            setShowMateriaprimaDetalles(true);
            setMateriaprimaDetalles(data);
            setMateriaprimaId(pk);
            setLotesForm([]);
        }
    };


    const getDisplayData = (): MateriaPrimaList[] | null => {

        if (inputfilterDoubleApplied) {

            console.log(listaMateriaPrimaFiltered)
            return listaMateriaPrimaFiltered.length > 0 
                ? listaMateriaPrimaFiltered
                : null;
        }

        if (MPFilteredInputSearchApplied) {
            return listaMateriaPrimaFilteredInputSearch.length > 0 
                ? listaMateriaPrimaFilteredInputSearch 
                : null;
        }

        if (filteredApplied) {
            return listaMateriaPrimaFiltered.length > 0 
                ? listaMateriaPrimaFiltered 
                : null;
        }

        return listaMateriaPrimaCached.length > 0 
            ? listaMateriaPrimaCached 
            : null;
    };

    const displayData = getDisplayData();

    const NoDataMessage = () => (
        <div className="flex justify-center mt-20 font-bold text-2xl text-gray-700">
            No hay datos Registrados
        </div>
    );

    const DataTable = ({ data }: { data: MateriaPrimaList[] }) => (
        <div className="shadow-sm">
            <TableRows data={data} onclick={detallesMateriaPrimaPK} />
        </div>
    );

    return (
        <>
            {isLoading ? <div className="flex justify-center mt-20 font-bold text-2xl text-gray-700">Cargando...</div> : 
                displayData 
                    ? <DataTable data={displayData} />
                    : <NoDataMessage />
            }
        </>
    );
};
