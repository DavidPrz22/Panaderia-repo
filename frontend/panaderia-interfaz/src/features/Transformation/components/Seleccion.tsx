import React, { useEffect, useState } from "react";
import { useTransformacionContext } from "@/context/TransformacionContext";
import { getTransformaciones } from "../api/api";
import { SearchProductsOrigin } from "./SearchProductsOrigin";
import { SearchProductsDestino } from "./SearchProductsDestino";
import type { searchResults } from "../types/types";


export function TransformacionSelect() {
    const { transformacion, setTransformacion } = useTransformacionContext();
    const { loading, setLoading } = useTransformacionContext();
    const { error, setError } = useTransformacionContext();

    useEffect(() => {
    async function fetchTransformaciones() {
        try {
        setLoading(true)
        setError(null);
        // Solo pasamos los parámetros necesarios para filtrar (si es necesario)
        const response = await getTransformaciones({ 
            nombre_transformacion: "", // Puedes cambiar esto para filtrar por nombre
            cantidad_origen: 0,
            cantidad_destino: 0,
            fecha_creacion: new Date(),
            activo: true
        });
        
        // Asegúrate de que response tiene el formato esperado
        console.log("Datos recibidos:", response);
        
        // Actualiza el estado con las transformaciones
        if (response && Array.isArray(response)) {
            const mapped = response.map((t: any) => ({
                ...t,
                fecha_creacion: new Date(t.fecha_creacion)
            }));
            setTransformacion(mapped);
        } else {
            console.error("Formato de respuesta inesperado:", response);
            setError("Formato de datos incorrecto");
        }
        } catch (error) {
        console.error("Error cargando transformaciones:", error);
        setError("Error al cargar las transformaciones");
        } finally {
        setLoading(false);
        }
    }
    
    fetchTransformaciones();
  }, []); // Eliminé la dependencia a transformacion para evitar bucles infinitos

  return null; // Este componente solo carga datos, no renderiza UI
}

export default function Seleccion() {
    const { transformacion } = useTransformacionContext();
    const { loading, setLoading } = useTransformacionContext();
    const [selectedOrigin, setSelectedOrigin] = useState<searchResults | null>(null);
    const [selectedDestino, setSelectedDestino] = useState<searchResults | null>(null);

    return (
    <>
    <TransformacionSelect />
    <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl mx-auto relative border-2 border-gray-300 rounded-3xl p-6 mt-6 bg-white hover:shadow-md">
            <span className="flex flex-col text-2xl font-bold text-black-500">
                Seleccione Transformación
            {loading ? (
            <p className="mt-4 text-sm text-gray-500">Cargando transformaciones...</p>
            ) : (
            <select className="mt-4 items-center justify-center border border-gray-300 text-sm text-gray-500 rounded-md p-2 w-full max-w-md">
                <option value="">Seleccione una transformación</option>
                {transformacion && transformacion.length > 0 ? (
                    transformacion.map((t) => (
                        <option key={t.id} value={t.id}>
                        {t.nombre_transformacion}
                        </option>
                ))
                ) : (
                <option value="" disabled>No hay transformaciones disponibles</option>
                )}
            </select>
            )}
        </span>

            {/* Two column area for origin/destination */}
            <div className="mt-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col">
                        <label className="text-2xl font-bold text-black-500">Seleccione Producto de Origen</label>
                        <div className="relative mt-4 w-full max-w-md">
                            <SearchProductsOrigin
                                onSelect={(res) => setSelectedOrigin(res)}
                                selectedResult={selectedOrigin}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-2xl font-bold text-black-500">Seleccione Producto Destino</label>
                        <div className="relative mt-4 w-full max-w-md">
                            <SearchProductsDestino
                                onSelect={(res) => setSelectedDestino(res)}
                                selectedResult={selectedDestino}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="w-full max-w-6xl mx-auto flex justify-end gap-4 mt-8">
            <button className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 px-4 py-2 h-10 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100">
                Cancelar
            </button>
            <button className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 h-10 rounded cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-500">
                Ejecutar Transformación
            </button>
        </div>
    </div>
    
    </>
    );
}
