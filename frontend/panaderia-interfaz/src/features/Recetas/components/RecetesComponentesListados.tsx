import { useRecetasContext } from "@/context/RecetasContext";
import RecetasComponentList from "./RecetasComponentList";
import type { watchSetValueProps } from "../types/types";

export default function RecetesComponentesListados({watch, setValue}: watchSetValueProps) {
    const { componentesListadosReceta } = useRecetasContext();
    return (
        <div className="flex flex-col border border-gray-300 rounded-md">

                {componentesListadosReceta.length > 0 ? (
                    componentesListadosReceta.map((componente, index) => (
                    <RecetasComponentList key={index}
                        nombre={componente.nombre} 
                        type={componente.componente_tipo} 
                        id={componente.id_componente} 
                        last={index === componentesListadosReceta.length - 1} 
                        watch={watch}
                        setValue={setValue}
                    />
                    ))
                ) : (
                    <div className="text-center text-gray-500 h-[150px] flex items-center justify-center font-[Roboto] text-lg">
                    No hay componentes listados
                    </div>
                )}
        </div>
    )
}