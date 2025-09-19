import { useQuery } from "@tanstack/react-query";
import { createLotesMateriaPrimaQueryOptions } from "./materiaPrimaQueryOptions";

export const useLotesMateriaPrimaQuery = (
  materiaprimaId: number | null,
  showMateriaprimaDetalles: boolean,
) => {
  return useQuery({
    ...createLotesMateriaPrimaQueryOptions(materiaprimaId!),
    enabled: !!materiaprimaId && showMateriaprimaDetalles,
  });
};
