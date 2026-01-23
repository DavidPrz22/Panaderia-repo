import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchProductsOrigin } from "./SearchProductsOrigin";
import { SearchTransformaciones } from "./SearchTransformaciones";
import { SearchProductsDestino } from "./SearchProductsDestino";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Loader2 } from "lucide-react";
import type { searchResults } from "../types/types";
import { useEjecutarTransformacionMutation } from "../hooks/mutations/mutations";
import { EjecutarTransformacionSchema, type TEjecutarTransformacionSchema } from "../schemas/schemas";

export default function Seleccion() {
    // Estados locales para los objetos completos (necesarios para la UI de búsqueda)
    const [selectedTransformacion, setSelectedTransformacion] = useState<searchResults | null>(null);
    const [selectedOrigen, setSelectedOrigen] = useState<searchResults | null>(null);
    const [selectedDestino, setSelectedDestino] = useState<searchResults | null>(null);

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TEjecutarTransformacionSchema>({
        resolver: zodResolver(EjecutarTransformacionSchema),
        mode: "onChange",
    });

    const { mutate, isPending } = useEjecutarTransformacionMutation();

    const onSubmit = (data: TEjecutarTransformacionSchema) => {
        mutate({
            transformacionId: data.transformacion_id,
            productoOrigenId: data.producto_origen_id,
            productoDestinoId: data.producto_destino_id
        }, {
            onSuccess: () => {
                reset();
                setSelectedTransformacion(null);
                setSelectedOrigen(null);
                setSelectedDestino(null);
            }
        });
    };

    const handleReset = () => {
        reset();
        setSelectedTransformacion(null);
        setSelectedOrigen(null);
        setSelectedDestino(null);
    };

    const loading = isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-8 border border-gray-300 rounded-3xl p-8 mt-4 bg-white shadow-md">
            <div className="mb-10">
                <h2 className="text-md text-gray-900 mb-2 font-semibold">Seleccione Transformación</h2>
                <Controller
                    name="transformacion_id"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <SearchTransformaciones
                                onSelect={(res) => {
                                    setSelectedTransformacion(res);
                                    field.onChange(res ? Number(res.id) : undefined);
                                }}
                                selectedResult={selectedTransformacion}
                            />
                            {errors.transformacion_id && (
                                <p className="text-xs text-red-500">{String(errors.transformacion_id.message)}</p>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className="flex-col flex md:flex-row gap-8">
                <div className="flex-1">
                    <h3 className="text-md text-gray-900 mb-2 font-semibold">Seleccione Producto de Origen</h3>
                    <Controller
                        name="producto_origen_id"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1">
                                <SearchProductsOrigin
                                    onSelect={(res) => {
                                        setSelectedOrigen(res);
                                        field.onChange(res ? Number(res.id) : undefined);
                                    }}
                                    selectedResult={selectedOrigen}
                                />
                                {errors.producto_origen_id && (
                                    <p className="text-xs text-red-500">{String(errors.producto_origen_id.message)}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <div className="flex items-center justify-center pt-8">
                    <ArrowRight className="size-10 text-white bg-blue-500 rounded-full p-2" />
                </div>

                <div className="flex-1">
                    <h3 className="text-md text-gray-900 mb-2 font-semibold">Seleccione Producto Destino</h3>
                    <Controller
                        name="producto_destino_id"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1">
                                <SearchProductsDestino
                                    onSelect={(res) => {
                                        setSelectedDestino(res);
                                        field.onChange(res ? Number(res.id) : undefined);
                                    }}
                                    selectedResult={selectedDestino}
                                />
                                {errors.producto_destino_id && (
                                    <p className="text-xs text-red-500">{String(errors.producto_destino_id.message)}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto flex justify-end gap-4 mt-8">
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 px-4 py-2 h-10 rounded-lg cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100"
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 h-10 rounded-lg cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-500 min-w-[200px]"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ejecutando...
                        </>
                    ) : (
                        <>
                            <Play className="size-4" />
                            Ejecutar Transformación
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
