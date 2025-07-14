import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materiaPrimaSchema } from "@/lib/schemas";
import type { TMateriaPrimaSchema } from "@/lib/schemas";
import Button from "./Button";
import { fetchCategoriasMateriaPrima, fetchUnidadesMedida, clearCaches, handleMateriaPrima } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { translateApiError } from "@/lib/translations";
import type { MateriaPrimaFormSharedProps } from "@/lib/types";
import { MateriaPrimaFormInputContainer } from "./MateriaPrimaFormInputContainer";
import { MateriaPrimaFormSelectContainer } from "./MateriaPrimaFormSelectContainer";

export default function MateriaPrimaFormShared({ 
    isUpdate = false, 
    initialData, 
    onClose, 
    onSubmitSuccess,
    title 
}: MateriaPrimaFormSharedProps) {
    const [categoriasMateriaPrima, setCategoriasMateriaPrima] = useState([]);
    const [unidadesMedida, setUnidadesMedida] = useState([]);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        reset,
    } = useForm<TMateriaPrimaSchema>({
        resolver: zodResolver(materiaPrimaSchema),
        defaultValues: isUpdate && initialData ? {
            nombre: initialData.nombre,
            SKU: initialData.SKU,
            nombre_empaque_estandar: initialData.nombre_empaque_estandar || '',
            cantidad_empaque_estandar: initialData.cantidad_empaque_estandar || undefined,
            unidad_medida_empaque_estandar: initialData.unidad_medida_empaque_estandar_detail?.id,
            punto_reorden: initialData.punto_reorden,
            unidad_medida_base: initialData.unidad_medida_base_detail.id,
            categoria: initialData.categoria_detail.id,
            descripcion: initialData.descripcion || ''
        } : {}
    });

    // Move fetch logic to a memoized callback
    const fetchData = useCallback(async () => {
        try {
            const [categorias, unidades] = await Promise.all([
                fetchCategoriasMateriaPrima(),
                fetchUnidadesMedida()
            ]);
            setCategoriasMateriaPrima(categorias);
            setUnidadesMedida(unidades);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    function renderCategoriasMateriaPrima() {
        if (isUpdate && initialData) {
            return (
                <>
                    <option value={initialData.categoria_detail?.id}>{initialData.categoria_detail?.nombre_categoria}</option>
                    {categoriasMateriaPrima.map(
                        ({id, nombre_categoria}: {id: number, nombre_categoria: string}) => (
                            id !== initialData.categoria_detail?.id && (
                                <option key={id} value={id}>{nombre_categoria}</option>
                            )
                    ))}
                </>
            );
        }

        return (
            <>
                <option value="">Seleccione una categoria</option>
                {categoriasMateriaPrima.map(({id, nombre_categoria}: {id: number, nombre_categoria: string}) => (
                    <option key={id} value={id}>{nombre_categoria}</option>
                ))}
            </>
        );
    }

    function renderUnidadesMedida(type: string) {
        if (type === 'base' && isUpdate && initialData) {
            return (
                <>
                    <option value={initialData.unidad_medida_base_detail.id}>{initialData.unidad_medida_base_detail.nombre_completo}</option>
                    {unidadesMedida.map(({id, nombre_completo}: {id: number, nombre_completo: string}) => (
                        (id !== initialData.unidad_medida_base_detail.id) && (
                            <option key={id} value={id}>{nombre_completo}</option>
                        )
                    ))}
                </>
            );
        } else if (type === 'empaque' && isUpdate && initialData && initialData.unidad_medida_empaque_estandar_detail) {
            return (
                <>
                    <option value={initialData.unidad_medida_empaque_estandar_detail.id}>{initialData.unidad_medida_empaque_estandar_detail.nombre_completo}</option>
                    {unidadesMedida.map(({id, nombre_completo}: {id: number, nombre_completo: string}) => (
                        (id !== initialData.unidad_medida_empaque_estandar_detail.id) && (
                            <option key={id} value={id}>{nombre_completo}</option>
                        )
                    ))}
                </>
            );
        } 

        return (
                    <>
                    <option value="">Seleccione una unidad de medida</option>
                    {unidadesMedida.map(({id, nombre_completo}: {id: number, nombre_completo: string}) => (
                        <option key={id} value={id}>{nombre_completo}</option>
                    ))}
                </>
            );
        
    }

    const handleCancelButtonClick = () => {
        if (isUpdate) {
            reset();
            onClose();
        } else {
            onClose();
        }
    }

    const onSubmit = async (data: TMateriaPrimaSchema) => {
        //Clean up the data before sending
            const cleanedData = {
            ...data,
            cantidad_empaque_estandar: data.cantidad_empaque_estandar || null,
            unidad_medida_empaque_estandar: data.unidad_medida_empaque_estandar || null,
            nombre_empaque_estandar: data.nombre_empaque_estandar?.trim() || null,
            descripcion: data.descripcion?.trim() || null
        };

        const response = await handleMateriaPrima(cleanedData, initialData?.id);
        if (response.failed) {
            console.log(response.errorData);
            for (const fieldName in response.errorData) {
                if (Object.prototype.hasOwnProperty.call(response.errorData, fieldName)) {
                    const errorMessages = response.errorData[fieldName];
                    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                        const message = translateApiError(errorMessages[0]);
                        setError(fieldName as keyof TMateriaPrimaSchema, { message });
                    } else if (typeof errorMessages === 'string') {
                        const message = translateApiError(errorMessages);
                        setError(fieldName as keyof TMateriaPrimaSchema, { message });
                    }
                }
            }
        } else {
            clearCaches();
            reset();
            onSubmitSuccess();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} id="materiaprima-form">
            <div className="flex flex-col mx-6 rounded-md shadow-md">
                <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
                    {title}
                </div>
                <div className="flex flex-col gap-2 px-5 bg-white">
                    <div className="flex flex-col gap-2 border-b border-gray-300 py-8">
                        <MateriaPrimaFormInputContainer 
                            inputType="text" 
                            title="Nombre" 
                            name="nombre" 
                            register={register} 
                            errors={errors} 
                        />
                        <MateriaPrimaFormInputContainer 
                            inputType="text" 
                            title="SKU" 
                            name="SKU" 
                            register={register} 
                            errors={errors} 
                        />
                        <MateriaPrimaFormInputContainer 
                            inputType="text" 
                            title="Nombre del empaque" 
                            name="nombre_empaque_estandar" 
                            register={register} 
                            errors={errors} 
                            optional={true}
                        />
                        <MateriaPrimaFormInputContainer 
                            inputType="number" 
                            title="Cantidad del empaque" 
                            name="cantidad_empaque_estandar" 
                            register={register} 
                            errors={errors} 
                            optional={true}
                        />

                        <MateriaPrimaFormSelectContainer 
                            title="Unidad de medida empaque" 
                            name="unidad_medida_empaque_estandar" 
                            register={register} 
                            errors={errors} 
                            optional={true}
                        >
                            { isUpdate && initialData ? renderUnidadesMedida('empaque') : renderUnidadesMedida('')}
                        </MateriaPrimaFormSelectContainer>
                    </div>

                    <div className="flex flex-col gap-2 py-8 border-b border-gray-300">
                        <MateriaPrimaFormInputContainer 
                            inputType="number" 
                            title="Punto de reorden" 
                            name="punto_reorden" 
                            register={register} 
                            errors={errors} 
                            />

                        <MateriaPrimaFormSelectContainer 
                            title="Unidad de medida base" 
                            name="unidad_medida_base" 
                            register={register} 
                            errors={errors} 
                        >
                            { isUpdate && initialData ? renderUnidadesMedida('base') : renderUnidadesMedida('')}
                        </MateriaPrimaFormSelectContainer>


                        <MateriaPrimaFormSelectContainer 
                            title="Categoria" 
                            name="categoria" 
                            register={register} 
                            errors={errors} 
                        >
                            {renderCategoriasMateriaPrima()}
                        </MateriaPrimaFormSelectContainer>
                        
        
                        <MateriaPrimaFormInputContainer 
                            inputType="textarea" 
                            title="Descripcion" 
                            name="descripcion" 
                            register={register} 
                            errors={errors} 
                            optional={true} />
                    </div>
                </div>
                <div className="flex gap-2 justify-end py-4 px-5 bg-white">
                    <Button type="cancel" onClick={handleCancelButtonClick}>Cancelar</Button>
                    <Button type="submit" onClick={() => {}}>Guardar</Button>
                </div>
            </div>
        </form>
    );
} 