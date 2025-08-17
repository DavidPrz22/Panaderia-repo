import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  componentesRecetaSearch,
  deleteReceta,
  getRecetasSearch,
  registerReceta,
  updateReceta,
} from "../../api/api";
import { useRecetasContext } from "@/context/RecetasContext";
import type { TRecetasFormSchema } from "../../schemas/schemas";
import {
  recetasDetallesQueryOptions,
  recetasQueryOptions,
} from "../queries/RecetasQueryOptions";

export const useComponentesRecetaSearchMutation = () => {
  const { setSearchListComponentes } = useRecetasContext();
  return useMutation({
    mutationFn: (search: string) => componentesRecetaSearch(search),
    onSuccess: (data) => {
      setSearchListComponentes(data);
    },
    onError: (error) => {
      console.error("Error fetching componentes receta search:", error);
    },
  });
};

export const useRegisterRecetaMutation = () => {
  const { setComponentesListadosReceta } = useRecetasContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TRecetasFormSchema) => registerReceta(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: recetasQueryOptions.queryKey,
      });
      setComponentesListadosReceta([]);
    },
  });
};

export const useUpdateRecetaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recetaId,
      data,
    }: {
      recetaId: number;
      data: TRecetasFormSchema;
    }) => updateReceta(recetaId, data),
    onSuccess: async (_, { recetaId }) => {
      await queryClient.invalidateQueries({
        queryKey: recetasQueryOptions.queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: recetasDetallesQueryOptions(recetaId).queryKey,
      });
    },
  });
};

export const useDeleteRecetaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recetaId: number) => deleteReceta(recetaId),
    onSuccess: async (_, recetaId) => {
      await queryClient.invalidateQueries({
        queryKey: recetasQueryOptions.queryKey,
      });
      queryClient.removeQueries({
        queryKey: recetasDetallesQueryOptions(recetaId).queryKey,
      });
    },
  });
};

export const useRecetasSearchMutation = () => {
  const { setSearchListRecetaList } = useRecetasContext();
  return useMutation({
    mutationFn: (search: string) => getRecetasSearch(search),
    onSuccess: (data) => {
      setSearchListRecetaList(data);
    },
  });
};
