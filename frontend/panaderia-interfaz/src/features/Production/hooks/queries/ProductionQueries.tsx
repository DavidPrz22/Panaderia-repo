import { useQueries, useQuery } from "@tanstack/react-query"
import { finalesSearchOptions, intermediosSearchOptions } from "./ProductionQueryOptions";
import { componentsProductionOptions } from "./ProductionQueryOptions";
import { useProductionContext } from "@/context/ProductionContext";

export const useProductSearchQuery = () => {
    return useQueries({queries: [
        finalesSearchOptions,
        intermediosSearchOptions
    ]});
};

export const useComponentsProductionQuery = () => {

    const { productoId } = useProductionContext();

    return useQuery({
        ...componentsProductionOptions(productoId!),
        enabled: !!productoId,
    });
};