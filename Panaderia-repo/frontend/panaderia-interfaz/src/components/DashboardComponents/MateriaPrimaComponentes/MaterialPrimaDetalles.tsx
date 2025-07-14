import Button from "./Button"
import Title from "@/components/Title"
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { LotesTable } from "./Lotes/LotesTable"
import { DeleteComponent } from "../DeleteComponent";
import { DetailsField } from "../DetailsField";
import { DetailFieldValue } from "../DetailFieldValue";
import MateriaPrimaFormShared from "./MateriaPrimaFormShared";
import { LotesMateriaPrimaFormShared } from "./Lotes/LotesMateriaPrimaFormShared";
import { LotesMateriaPrimaDetalles } from "./Lotes/LotesMateriaPrimaDetalles";

import { 
    handleDeleteMateriaPrima, 
    handleLotesMateriaPrimaLotes } from "@/lib/utils";

import type {
    LoteMateriaPrimaFormResponse, 
    emptyLoteMateriaPrima } from "@/lib/types";


export const MaterialPrimaDetalles = () => {
    const { 
        showMateriaprimaDetalles, setShowMateriaprimaDetalles,
        materiaprimaDetalles, setMateriaprimaDetalles,
        registroDelete, setRegistroDelete,
        updateRegistro, setUpdateRegistro,
        showLotesForm, setShowLotesForm,
        lotesForm, setLotesForm,
        showLotesMateriaPrimaDetalles,
    } = useAppContext();

    useEffect(() => {
        if (!showMateriaprimaDetalles || !materiaprimaDetalles?.id) return;
        
        async function handleLotes() {
            let lotes = await handleLotesMateriaPrimaLotes(materiaprimaDetalles?.id);

            if (lotes) {
                const isEmptyMP = lotes.find((lote: LoteMateriaPrimaFormResponse | emptyLoteMateriaPrima) => {
                    if ('empty' in lote) {
                        return lote.materia_prima === materiaprimaDetalles?.id && lote.empty === true;
                    }
                    return false;
                });
                console.log('lotes', lotes);
                if (!isEmptyMP) {
                    lotes = lotes.filter((lote: LoteMateriaPrimaFormResponse) => lote.materia_prima === materiaprimaDetalles?.id);
                    setLotesForm([...lotes]);
                } else {
                    setLotesForm([]);
                }
            }
        }

        handleLotes();
    }, [materiaprimaDetalles?.id, showMateriaprimaDetalles, setLotesForm]);

    if (!showMateriaprimaDetalles) return <></>;

    function handleClose() {
        setShowMateriaprimaDetalles(false); 
        setMateriaprimaDetalles(null);
        setUpdateRegistro(false);
    }

    const handleDelete = async () => {
        if (materiaprimaDetalles?.id) {
            const response = await handleDeleteMateriaPrima(materiaprimaDetalles?.id);
            if (response?.success) {
                setRegistroDelete(false);
                handleClose();
            }
        }
    }

    const handleCloseUpdate = () => {
        setUpdateRegistro(false);
    }

    if (showLotesMateriaPrimaDetalles) {
        return (
            <LotesMateriaPrimaDetalles
            />
        )
    }

    if (showLotesForm) {
        return (
            <LotesMateriaPrimaFormShared
                title="Nuevo Lote"

                onClose={() => {
                    setShowLotesForm(false); 
                    setShowMateriaprimaDetalles(true);
                }}

                onSubmitSuccess={() => {
                    setShowLotesForm(false);
                    setShowMateriaprimaDetalles(true);
                }}
            />
        )
    }

    if (updateRegistro && materiaprimaDetalles) {
        return (
            <MateriaPrimaFormShared
                isUpdate={true}
                initialData={materiaprimaDetalles}
                title="Editar Materia Prima"
                onClose={handleCloseUpdate}
                onSubmitSuccess={handleClose}
            />
        );
    }

    return (
        <div className="flex flex-col gap-5 mx-5 bg-white p-5 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <Title>{materiaprimaDetalles?.nombre || '-'}</Title>
                <div className="flex gap-2">
                    <Button type="edit" onClick={() => setUpdateRegistro(true)}>
                        <div className="flex items-center gap-2">
                            Editar
                            <img src='/DashboardAssets/Editar.svg' alt="Editar" />
                        </div>
                    </Button>
                    <Button type="delete" onClick={() => {setRegistroDelete(true)}}>
                        <div className="flex items-center gap-2">
                            Eliminar
                            <img src='/DashboardAssets/Borrar.svg' alt="Eliminar" />
                        </div>
                    </Button>
                    <div className="ml-6">
                        <Button type="close" onClick={handleClose}> 
                            <img src='/DashboardAssets/Cerrar.svg' alt="Cerrar" />
                        </Button>
                    </div>
                </div>
            </div>

            {registroDelete && <DeleteComponent deleteFunction={handleDelete} />}
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold font-[Roboto] text-blue-600 border-b border-gray-300 pb-2">Detalles</h2>

                <div className="flex items-center gap-20">
                    <div className="grid grid-rows-12 grid-cols-1 gap-2">
                        <DetailsField>Nombre</DetailsField>
                        <DetailsField>SKU</DetailsField>
                        <DetailsField>Punto de reorden</DetailsField>
                        <DetailsField>Unidad de medida</DetailsField>
                        <DetailsField>Categoría</DetailsField>
                        <DetailsField>Nombre de empaque</DetailsField>
                        <DetailsField>Cantidad de empaquete</DetailsField>
                        <DetailsField>Unidad de medida de empaque</DetailsField>
                        <DetailsField>Fecha de última actualización</DetailsField>
                        <DetailsField>Fecha de creación del registro</DetailsField>
                        <DetailsField>Fecha de modificación del registro</DetailsField>
                        <DetailsField>Descripción</DetailsField>
                    </div>
                    <div className="grid grid-rows-12 grid-cols-1 gap-2">
                        <DetailFieldValue>{materiaprimaDetalles?.nombre || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.SKU || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.punto_reorden || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.unidad_medida_base_detail?.nombre_completo || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.categoria_detail?.nombre_categoria || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.nombre_empaque_estandar || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.cantidad_empaque_estandar || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.unidad_medida_empaque_estandar_detail?.nombre_completo || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.fecha_ultima_actualizacion || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.fecha_creacion_registro || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.fecha_modificacion_registro || '-'}</DetailFieldValue>
                        <DetailFieldValue>{materiaprimaDetalles?.descripcion || '-'}</DetailFieldValue>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-5 h-full">
                <div className="flex justify-between items-center pr-5">
                    <Title extraClass="text-blue-600">Lotes de materia prima</Title>
                    <Button type="add" onClick={()=> { setShowLotesForm(true)}}>
                        <div className="flex items-center gap-2">
                            Agregar Lote
                            <img className='p-0.5 border border-white rounded-full size-7' src="/DashboardAssets/Plussign.svg" alt="agregar" />
                        </div>
                    </Button>
                </div>
                {lotesForm.length > 0 ? 
                    <LotesTable lotes={lotesForm}/> : 
                    <div className="flex justify-center items-center h-full rounded-md border border-gray-300">
                        <p className="text-lg text-gray-500 font-bold font-[Roboto]">No hay lotes registrados</p>
                    </div>
                }

            </div>
        </div>
    )
}