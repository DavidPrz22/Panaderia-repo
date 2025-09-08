import { useMutation } from "@tanstack/react-query";
import { createProduction } from "../../api/api";
import type { TProductionFormData } from "../../schemas/schemas";

export const useCreateProductionMutation = () => {
    return useMutation({
        mutationFn: (data: TProductionFormData) => createProduction(data)
    })
}