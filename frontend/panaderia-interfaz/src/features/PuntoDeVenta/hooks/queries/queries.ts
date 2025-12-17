import { useQuery } from "@tanstack/react-query";
import { bcvRateOptions, isActiveCajaOptions } from "./options";

export const useIsActiveCajaQuery = () => {
    return useQuery(isActiveCajaOptions);
}

export const useBCVRateQuery = () => {
    return useQuery(bcvRateOptions);
}