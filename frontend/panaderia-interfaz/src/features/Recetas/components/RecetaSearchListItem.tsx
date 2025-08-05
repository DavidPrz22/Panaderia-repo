import type { componenteListadosReceta, itemRecetasSearchList, watchSetValueProps } from "../types/types"
import { useRecetasContext } from "@/context/RecetasContext"

export default function RecetaSearchListItem({nombre, id, tipo, watch, setValue}: itemRecetasSearchList & watchSetValueProps) {
    const { setComponentesListadosReceta, componentesListadosReceta } = useRecetasContext();

    const handleClick = () => {
    const componente: componenteListadosReceta = {
        id_componente: id,
        componente_tipo: tipo,
        nombre: nombre,
    }

    // Create the component data for the form
    let componenteReceta;
    if (tipo === "MateriaPrima") {
        componenteReceta = {
            componente_id: Number(id),
            materia_prima: true,
        }
    } else {
        componenteReceta = {
            componente_id: Number(id),
            producto_intermedio: true,
        }
    }
    
    const currentFormData = watch("componente_receta") || [];
    // Check if component already exists in context (for display)
    if (componentesListadosReceta.find((componente) => componente.id_componente === id) || 
        currentFormData.find((item) => item.componente_id === Number(id))) {
        return;
    }
    
    // Update context for display
    setComponentesListadosReceta([...componentesListadosReceta, componente]);
    
    // Update form field
    setValue("componente_receta", [...currentFormData, componenteReceta]);
    }

    return (
        <li 
        data-tipo={tipo}
        id={id} 
        className={`py-2 px-6 border-b border-gray-300 hover:bg-gray-100 cursor-pointer `} onClick={() => handleClick()}>
            {nombre}
        </li>
    )
}