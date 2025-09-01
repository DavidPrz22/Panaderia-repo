import { searchProductosFinales, searchProductosIntermedios } from "../../api/api"

export const finalesSearchOptions = {
    queryKey: ["productosFinales"],
    queryFn: searchProductosFinales,
    staleTime: Infinity
}

export const intermediosSearchOptions = {
    queryKey: ["productosIntermedios"],
    queryFn: searchProductosIntermedios,
    staleTime: Infinity
}