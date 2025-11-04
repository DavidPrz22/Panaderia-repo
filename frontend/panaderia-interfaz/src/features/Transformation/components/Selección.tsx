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
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto border-2 border-gray-300 rounded-3xl p-6 mt-6 bg-white hover:shadow-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Seleccione Transformación</h2>
                    <SearchTransformaciones 
                        onSelect={setSelectedTransformacion} 
                        selectedResult={selectedTransformacion} 
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">Seleccione Producto de Origen</h3>
                        <SearchProductsOrigin 
                            onSelect={setSelectedOrigen} 
                            selectedResult={selectedOrigen} 
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">Seleccione Producto Destino</h3>
                        <SearchProductsDestino 
                            onSelect={setSelectedDestino} 
                            selectedResult={selectedDestino} 
                        />
                    </div>
                </div>

                {message && (
                    <div className={`mt-4 text-sm ${message.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="w-full max-w-6xl mx-auto flex justify-end gap-4 mt-8">
                <button className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 px-4 py-2 h-10 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100">
                    Cancelar
                </button>
                <button
                    className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 h-10 rounded cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-500"
                    onClick={handleEjecutarTransformacion}
                    disabled={loading}
                >
                    {loading ? "Ejecutando..." : "Ejecutar Transformación"}
                </button>
            </div>
        </div>
    );
}
