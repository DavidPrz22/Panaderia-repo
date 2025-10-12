import { useState } from "react";
import apiClient from "@/api/client";
import { SearchProductsOrigin } from "./SearchProductsOrigin";
import { SearchTransformaciones } from "./SearchTransformaciones";
import { SearchProductsDestino } from "./SearchProductsDestino"; // Importar el nuevo componente
import type { searchResults } from "../types/types";

export default function Seleccion() {
    const [selectedTransformacion, setSelectedTransformacion] = useState<searchResults | null>(null);
    const [selectedOrigen, setSelectedOrigen] = useState<searchResults | null>(null);
    const [selectedDestino, setSelectedDestino] = useState<searchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleEjecutarTransformacion = async () => {
        setMessage(null);
        if (!selectedTransformacion || !selectedOrigen || !selectedDestino) {
            setMessage("Selecciona transformación, producto de origen y destino.");
            return;
        }
        setLoading(true);
        try {
            const response = await apiClient.post("/api/ejecutar-transformacion/", {
                transformacionId: selectedTransformacion.id,
                productoOrigenId: selectedOrigen.id,
                productoDestinoId: selectedDestino.id,
            });
            if (response.status === 200) {
                setMessage("Transformación ejecutada correctamente.");
            } else {
                setMessage("Error al ejecutar la transformación.");
            }
        } catch (error: any) {
            setMessage(error?.response?.data?.error || "Error al ejecutar la transformación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-start justify-start">
                <div className="flex flex-col items-start justify-start ml-90 border-2 border-gray-300 rounded-3xl w-290 p-6 mt-6  bg-white hover:shadow-md">
                    <span className="flex flex-col ml-10 text-2xl font-bold text-black-500">
                        Seleccione Transformación
                        <SearchTransformaciones 
                            onSelect={setSelectedTransformacion} 
                            selectedResult={selectedTransformacion} 
                        />
                    </span>

                    <div className="flex ml-10 gap-20 mt-10">
                        <span className="flex flex-col text-2xl font-bold text-black-500">
                            Seleccione Producto de Origen
                            <SearchProductsOrigin 
                                onSelect={setSelectedOrigen} 
                                selectedResult={selectedOrigen} 
                            />
                        </span>

                        <span className="flex flex-col text-2xl font-bold text-black-500">
                            Seleccione Producto Destino
                            <SearchProductsDestino 
                                onSelect={setSelectedDestino} 
                                selectedResult={selectedDestino} 
                            />
                        </span>
                    </div>
                    {message && (
                        <div className={`mt-4 text-sm ${message.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-start -ml-85 mt-110 gap-2">
                    <button className="flex items-center gap-3 bg-white-600 text-gray-600 border border-gray-300 px-4 py-2 h-10 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button
                        className="flex items-center gap-3 bg-blue-600 text-white border border-gray-300 px-4 py-2 w-55 h-10 rounded cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-300"
                        onClick={handleEjecutarTransformacion}
                        disabled={loading}
                    >
                        {loading ? "Ejecutando..." : "Ejecutar Transformación"}
                    </button>
                </div>
            </div>
        </>
    );
}
