import Title from "@/components/Title";
import Button from "../Button";
import { DetailsField } from "../../DetailsField";
import { DetailFieldValue } from "../../DetailFieldValue";

import { DeleteComponent } from "../../DeleteComponent";
import { useAppContext } from "@/context/AppContext";
import { handleActivateLoteMateriaPrima, handleDeleteLoteMateriaPrima, handleLotesMateriaPrimaLotes } from "@/lib/utils";
import { LotesMateriaPrimaFormShared } from "./LotesMateriaPrimaFormShared";
import type { LoteMateriaPrimaFormResponse } from "@/lib/types";

export const LotesMateriaPrimaDetalles = () => {
    const {
        materiaprimaDetalles,
        lotesMateriaPrimaDetalles,
        registroDelete,
        updateRegistro,
        setShowMateriaprimaDetalles,
        setLotesMateriaPrimaDetalles,
        setShowLotesMateriaPrimaDetalles,
        setUpdateRegistro,
        setRegistroDelete,
        setLotesForm
    } = useAppContext();

    const updateLotes = async () => {
        const lotes = await handleLotesMateriaPrimaLotes(materiaprimaDetalles?.id);
        if (lotes) {
            setLotesForm(lotes);
            const loteDetails = lotes.find((lote: LoteMateriaPrimaFormResponse) => lote.id === lotesMateriaPrimaDetalles?.id);
            if (loteDetails) {
                setLotesMateriaPrimaDetalles(loteDetails);
            }
        }
    }

    const handleDelete = async () => {
        const response = await handleDeleteLoteMateriaPrima(lotesMateriaPrimaDetalles?.id);

        if (response.success) {
            handleClose();
            const lotes = await handleLotesMateriaPrimaLotes(materiaprimaDetalles?.id);
            if (lotes) {
                setLotesForm(lotes);
            }
        }
    }

    const handleEdit = () => {
        setUpdateRegistro(true);
    }

    function handleClose() {
        setShowMateriaprimaDetalles(true); 
        setUpdateRegistro(false);
        setShowLotesMateriaPrimaDetalles(false);
        setRegistroDelete(false);
    }


    const handleActivate = async () => {
        const response = await handleActivateLoteMateriaPrima(lotesMateriaPrimaDetalles?.id);
        if (response.success) {
            updateLotes();
            handleClose();
        }
    }

    if (updateRegistro && lotesMateriaPrimaDetalles) {
        return (
            <LotesMateriaPrimaFormShared
                title="Editar Lote"
                isUpdate={true}
                initialData={lotesMateriaPrimaDetalles}
                onClose={() => {
                    setUpdateRegistro(false);
                    setShowLotesMateriaPrimaDetalles(true);
                }}
                onSubmitSuccess={() => {
                    setUpdateRegistro(false);
                    setShowLotesMateriaPrimaDetalles(true);
                    updateLotes();
                }}
            />
        )
    }
        return (
        <div className="flex flex-col gap-5 mx-5 bg-white p-5 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <Title>Detalles de lote de materia prima</Title>
                <div className="flex gap-2">
                    <Button type="edit" onClick={handleEdit}>
                        <div className="flex items-center gap-2">
                            Editar
                            <img src='/DashboardAssets/Editar.svg' alt="Editar" />
                        </div>
                    </Button>
                    <Button type="delete" onClick={() => setRegistroDelete(true)}>
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
                    <div className="grid grid-rows-9 grid-cols-1 gap-2">
                        <DetailsField><div className="text-lg">Materia prima</div></DetailsField>
                        <DetailsField><div className="text-lg">Proveedor</div></DetailsField>
                        <DetailsField><div className="text-lg">Fecha de recepción</div></DetailsField>
                        <DetailsField><div className="text-lg">Fecha de caducidad</div></DetailsField>
                        <DetailsField><div className="text-lg">Cantidad recibida</div></DetailsField>
                        <DetailsField><div className="text-lg">Stock actual</div></DetailsField>
                        <DetailsField><div className="text-lg">Costo unitario USD</div></DetailsField>
                        <DetailsField><div className="text-lg">Detalles Orden de Compra</div></DetailsField>
                        <DetailsField><div className="text-lg">Activo</div></DetailsField>
                    </div>
                    <div className="grid grid-rows-9 grid-cols-1 gap-2">
                        <DetailFieldValue><div className="text-lg">{materiaprimaDetalles?.nombre || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.proveedor?.nombre_comercial || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">
                            {lotesMateriaPrimaDetalles?.fecha_recepcion ?
                                new Date(lotesMateriaPrimaDetalles?.fecha_recepcion).toLocaleDateString('es-ES') 
                                : '-'
                            }</div>
                        </DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">
                            {lotesMateriaPrimaDetalles?.fecha_caducidad ?
                                new Date(lotesMateriaPrimaDetalles?.fecha_caducidad).toLocaleDateString('es-ES') 
                                : '-'
                            }</div>
                        </DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.cantidad_recibida || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.stock_actual_lote || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.costo_unitario_usd || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.detalle_oc || '-'}</div></DetailFieldValue>
                        <DetailFieldValue><div className="text-lg">{lotesMateriaPrimaDetalles?.activo ? 'SI' : 'NO'}</div></DetailFieldValue>
                    </div>
                </div>
            </div>
            {lotesMateriaPrimaDetalles?.activo === false ? 
                    <div className="flex justify-end mt-auto mr-2">
                        <Button type="add" onClick={handleActivate}>
                            <div className="flex items-center gap-2 text-xl font-semibold">
                                Activar Lote
                                <img src='/DashboardAssets/Check.svg' alt="Activar Lote" className="size-7" />
                            </div>
                        </Button> 
                    </div> : ''
                }
        </div>
    )
}

