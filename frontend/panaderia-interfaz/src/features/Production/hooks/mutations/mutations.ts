import { useMutation } from "@tanstack/react-query";
import { createProduction, componentesRecetaSearch } from "../../api/api";
import type { TProductionFormData } from "../../schemas/schemas";
import { useProductionContext } from "@/context/ProductionContext";

export const useCreateProductionMutation = () => {
    return useMutation({
        mutationFn: (data: TProductionFormData) => createProduction(data)
    })
}

export const useComponentesProductionSearchMutation = () => {
    const { setComponentSearchList } = useProductionContext();
    return useMutation({
    mutationFn: (search: string) => componentesRecetaSearch(search),
    onSuccess: (data) => {
        setComponentSearchList(data);
    },
    onError: (error) => {
        console.error("Error fetching componentes receta search:", error);
    },
    });
};