import { useInfiniteQuery } from "@tanstack/react-query";
import { lotesMateriaPrimaQueryOptions } from "./materiaPrimaQueryOptions";

export const useLotesMateriaPrimaQuery = (
  materiaprimaId: number | null,
  showMateriaprimaDetalles: boolean,
) => {
  return useInfiniteQuery({
    ...lotesMateriaPrimaQueryOptions(materiaprimaId!),
    enabled: !!materiaprimaId && showMateriaprimaDetalles,
  });
};
