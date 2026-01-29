import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { createMateriaPrimaListQueryOptions, lotesMateriaPrimaQueryOptions } from "./materiaPrimaQueryOptions";

export const useGetMateriaPrima = () => {
  return useInfiniteQuery(createMateriaPrimaListQueryOptions());
};

export const useLotesMateriaPrimaQuery = (
  materiaprimaId: number | null,
  showMateriaprimaDetalles: boolean,
) => {
  return useInfiniteQuery({
    ...lotesMateriaPrimaQueryOptions(materiaprimaId!),
    enabled: !!materiaprimaId && showMateriaprimaDetalles,
  });
};
