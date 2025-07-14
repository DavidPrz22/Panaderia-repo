import { loteMateriaPrimaSchema, type TLoteMateriaPrimaSchema } from "@/lib/schemas";
import { handleCreateUpdateLoteMateriaPrima, handleLotesMateriaPrimaLotes, handleProveedores } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import Button from "../Button";
import { LotesMateriaPrimaInputContainer } from "./LotesMateriaPrimaInputContainer";
import { LotesMateriaPrimaSelectContainer } from "./LotesMateriaPrimaSelectContainer";
import type { LoteMateriaPrimaFormSumit, LotesMateriaPrimaFormSharedProps } from "@/lib/types";

export const LotesMateriaPrimaFormShared = ({title, isUpdate = false, initialData, onClose, onSubmitSuccess}: LotesMateriaPrimaFormSharedProps) => {

    const { setLotesForm, materiaprimaId  } = useAppContext();
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm<TLoteMateriaPrimaSchema>({
        resolver: zodResolver(loteMateriaPrimaSchema),
        defaultValues: initialData || {}
    });

    const [proveedores, setProveedores] = useState<{id: number, nombre_comercial: string}[]>([]);

    async function onSubmit(data: TLoteMateriaPrimaSchema) {
        const formatedData = {
            ...data,
            materia_prima: materiaprimaId,
        }

        const response = await handleCreateUpdateLoteMateriaPrima(formatedData as LoteMateriaPrimaFormSumit, isUpdate ? initialData?.id : undefined);

        if (response.success) {
            const lotes = await handleLotesMateriaPrimaLotes(materiaprimaId!);

            if (lotes) {
                setLotesForm(lotes);
            } else {
                setLotesForm([]);
            }

            onSubmitSuccess();
            reset();
        }
    }


    useEffect(() => {
        const fetchProveedores = async () => {
            const proveedores = await handleProveedores();
            setProveedores(proveedores);
        };
        fetchProveedores();
    }, []);

    return (

        <>
        <form onSubmit={handleSubmit(onSubmit)} id="lote-form">
            <div className="flex flex-col mx-6 rounded-md shadow-md">
                <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
                    {title}
                </div>
                <div className="flex flex-col gap-2 px-5 bg-white">
                    <div className="flex flex-col gap-2 border-b border-gray-300 py-8">
                        <LotesMateriaPrimaInputContainer 
                            inputType="number" 
                            title="Cantidad recibida" 
                            name="cantidad_recibida" 
                            register={register} 
                            errors={errors}
                        />
                        <LotesMateriaPrimaInputContainer 
                            inputType="number" 
                            title="Costo unitario USD" 
                            name="costo_unitario_usd" 
                            register={register} 
                            errors={errors}
                        />
                        <LotesMateriaPrimaSelectContainer 
                            title="Proveedor" 
                            name="proveedor_id" 
                            register={register} 
                            errors={errors}
                        >
                            <option value="">Selecciona un proveedor</option>
                            {proveedores.map(({id, nombre_comercial}) => (
                                <option key={id} value={id}>{nombre_comercial}</option>
                            ))}
                        </LotesMateriaPrimaSelectContainer>

                        <LotesMateriaPrimaInputContainer 
                            inputType="date" 
                            title="Fecha de recepción" 
                            name="fecha_recepcion" 
                            register={register} 
                            errors={errors}
                        />          
                        <LotesMateriaPrimaInputContainer 
                            inputType="date" 
                            title="Fecha de caducidad" 
                            name="fecha_caducidad" 
                            register={register} 
                            errors={errors}
                        />
                    </div>

                </div>
                <div className="flex gap-2 justify-end py-4 px-5 bg-white">
                    <Button type="cancel" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button type="submit" onClick={() => {}}>
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
        </>
    )

}