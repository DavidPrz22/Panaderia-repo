import { useMutation } from "@tanstack/react-query";
import { searchProductosOC } from "../../api/api";

export const useProductosSearchMutation = () => {
    return useMutation({
        mutationFn: (params: any) => searchProductosOC(params)

    })
}