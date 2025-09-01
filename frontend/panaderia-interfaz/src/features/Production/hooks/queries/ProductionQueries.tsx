import { useQueries } from "@tanstack/react-query"
import { finalesSearchOptions, intermediosSearchOptions } from "./ProductionQueryOptions";

export const useProductSearchQuery = () => {
    return useQueries({queries: [
        finalesSearchOptions,
        intermediosSearchOptions
    ]});
};
