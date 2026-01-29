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
import type { QueryClient } from "@tanstack/react-query";
import type { RecetasPagination } from "../../types/types";

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
  const { setComponentesListadosReceta, setRecetasListadas } =
    useRecetasContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TRecetasFormSchema) => registerReceta(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: recetasQueryOptions.queryKey,
      });
      setComponentesListadosReceta([]);
      setRecetasListadas([]);
    },
  });
};

type PageData = {
  pages: RecetasPagination[],
  pageParams: (string | null)[]
}

const invalidatePage = async (page: number, queryClient: QueryClient) => {
  const pageOption = recetasQueryOptions.queryKey;

  // Retrieve the current infinite query data
  const data = queryClient.getQueryData<PageData>(pageOption);
  if (!data) return;

  const currentPageParam = data.pageParams[page];

  // Fetch the specific page data without overwriting the main cache key immediately
  // We use a temporary key or just call the function directly to avoid cache collisions
  const invalidatedPageData = await queryClient.fetchQuery({
    queryKey: [...pageOption, "page", page],
    queryFn: () => recetasQueryOptions.queryFn({ pageParam: currentPageParam }),
    staleTime: 0,
  });

  // Immutably update the cache
  queryClient.setQueryData<PageData>(pageOption, (oldData) => {
    if (!oldData) return undefined;

    const newPages = [...oldData.pages];
    if (newPages[page]) {
      newPages[page] = invalidatedPageData;
    }

    return {
      ...oldData,
      pages: newPages,
    };
  });
};


export const useUpdateRecetaMutation = () => {
  const { setRecetasListadas, setComponentesListadosReceta, currentPage } =
    useRecetasContext();
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
        queryKey: recetasDetallesQueryOptions(recetaId).queryKey,
      });

      await invalidatePage(currentPage, queryClient)
      // await queryClient.invalidateQueries({
      //   queryKey: recetasQueryOptions.queryKey,
      // });

      setRecetasListadas([]);
      setComponentesListadosReceta([]);
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
    mutationFn: ({ search, recetaId }: { search: string, recetaId?: number }) => getRecetasSearch(search, recetaId),
    onSuccess: (data) => {
      setSearchListRecetaList(data);
    },
  });
};
