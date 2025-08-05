import { getRecetas } from "../../api/api";

export const recetasQueryOptions = {
    queryKey: ['recetas'],
    queryFn: getRecetas,
    staleTime: Infinity
}