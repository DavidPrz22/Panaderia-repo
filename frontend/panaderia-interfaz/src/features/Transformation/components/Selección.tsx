import { useState } from "react";
import { SearchProductsOrigin } from "./SearchProductsOrigin";
import { SearchTransformaciones } from "./SearchTransformaciones";
import { SearchProductsDestino } from "./SearchProductsDestino";
import type { searchResults } from "../types/types";
import { BotonEjecutarTransformacion } from "./BotonEjecutarTransformacion";
import { ArrowRight } from "lucide-react";
export default function Seleccion() {
    const [selectedTransformacion, setSelectedTransformacion] = useState<searchResults | null>(null);
    const [selectedOrigen, setSelectedOrigen] = useState<searchResults | null>(null);
    const [selectedDestino, setSelectedDestino] = useState<searchResults | null>(null);

    const handleSuccess = () => {
        setSelectedTransformacion(null);
        setSelectedOrigen(null);
        setSelectedDestino(null);
    };

    return (
            <div className="mx-8 border border-gray-300 rounded-3xl p-8 mt-4 bg-white shadow-md">
                <div className="mb-10">
                    <h2 className="text-md text-gray-900 mb-2">Seleccione Transformación</h2>
                    <SearchTransformaciones
                        onSelect={setSelectedTransformacion}
                        selectedResult={selectedTransformacion}
                    />
                </div>

                <div className="flex-col flex md:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="text-md text-gray-900 mb-2">Seleccione Producto de Origen</h3>
                        <SearchProductsOrigin
                            onSelect={setSelectedOrigen}
                            selectedResult={selectedOrigen}
                        />
                    </div>
                    <ArrowRight className="size-10 text-white bg-blue-500 rounded-full p-2 self-end" />

                    <div className="flex-1">
                        <h3 className="text-md text-gray-900 mb-2">Seleccione Producto Destino</h3>
                        <SearchProductsDestino
                            onSelect={setSelectedDestino}
                            selectedResult={selectedDestino}
                        />
                    </div>
                </div>

                {/* Execute transformation button */}
                <div className="w-full max-w-6xl mx-auto flex justify-end gap-4 mt-8">
                    <button className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 px-4 py-2 h-10 rounded-lg cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100">
                        Cancelar
                    </button>
                    <BotonEjecutarTransformacion
                        transformacionId={selectedTransformacion?.id}
                        productoOrigenId={selectedOrigen?.id}
                        productoDestinoId={selectedDestino?.id}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>
    );
}

