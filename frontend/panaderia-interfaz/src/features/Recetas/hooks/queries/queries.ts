import { useQuery } from "@tanstack/react-query";
import { recetasQueryOptions } from "./RecetasQueryOptions";

export const useRecetasQuery = () => {
    return useQuery(recetasQueryOptions);
}