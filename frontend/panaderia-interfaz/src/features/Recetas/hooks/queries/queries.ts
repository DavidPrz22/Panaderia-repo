import { useQuery } from "@tanstack/react-query";
import { recetasDetallesQueryOptions, recetasQueryOptions } from "./RecetasQueryOptions";
import { useRecetasContext } from "@/context/RecetasContext";

export const useRecetasQuery = () => {
    return useQuery(recetasQueryOptions);
}

export const useRecetaDetallesQuery = (id: number) => {
    const { recetaId } = useRecetasContext();
    return useQuery({
        ...recetasDetallesQueryOptions(id), 
        enabled: !!recetaId && recetaId === id
    });
}
