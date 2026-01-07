import { useMutation } from "@tanstack/react-query";

import {
  handleActivateLoteMateriaPrima,
  handleInactivateLoteMateriaPrima,
  handleDeleteLoteMateriaPrima,
  handleDeleteMateriaPrima,
  handleCreateUpdateLoteMateriaPrima,
  handleCreateUpdateMateriaPrima,
  uploadCSV
} from "../../api/api";

import {
  createLotesMateriaPrimaQueryOptions,
  createMateriaPrimaListQueryOptions,
  createMateriaPrimaListPKQueryOptions,
} from "../../hooks/queries/materiaPrimaQueryOptions";


import { useQueryClient } from "@tanstack/react-query";

import type {
  LoteMateriaPrimaFormSumit,
  submitMateriaPrima,
} from "../../types/types";
import type { TMateriaPrimaSchema } from "../../schemas/schemas";
import { translateApiError } from "@/data/translations";

import type { UseFormSetError } from "react-hook-form";

export const useDeleteMateriaPrimaMutation = (
  handleClose: () => void,
  materiaprimaId: number | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await handleDeleteMateriaPrima(id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: createMateriaPrimaListQueryOptions().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: createMateriaPrimaListPKQueryOptions(materiaprimaId!)
            .queryKey,
        }),
      ]);
      handleClose();
    },
  });
};

export const useCreateUpdateMateriaPrimaMutation = (
  onSubmitSuccess: () => void,
  setError: UseFormSetError<TMateriaPrimaSchema>,
  initialDataId?: number | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: submitMateriaPrima) => {
      const response = await handleCreateUpdateMateriaPrima(
        data,
        initialDataId,
      );
      if (response.failed) {
        throw response; // This will trigger the onError callback
      }
      return response;
    },
    onSuccess: async () => {
      onSubmitSuccess();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: createMateriaPrimaListQueryOptions().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: createMateriaPrimaListPKQueryOptions(initialDataId || null)
            .queryKey,
        }),
      ]);
    },
    onError: (error: {
      failed: boolean;
      errorData: Record<string, string[]>;
    }) => {
      if (error.failed) {
        for (const fieldName in error.errorData) {
          if (
            Object.prototype.hasOwnProperty.call(error.errorData, fieldName)
          ) {
            const errorMessages = error.errorData[fieldName];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              const message = translateApiError(errorMessages[0]);
              setError(fieldName as keyof TMateriaPrimaSchema, { message });
            } else if (typeof errorMessages === "string") {
              const message = translateApiError(errorMessages);
              setError(fieldName as keyof TMateriaPrimaSchema, { message });
            }
          }
        }
      }
    },
  });
};

// Lotes Materia Prima
export const useDeleteLoteMateriaPrimaMutation = (
  materiaprimaId: number | undefined,
  handleClose: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await handleDeleteLoteMateriaPrima(id);
    },
    onSuccess: async () => {
      if (materiaprimaId) {
        await queryClient.invalidateQueries({
          queryKey:
            createLotesMateriaPrimaQueryOptions(materiaprimaId).queryKey,
        });
        await queryClient.invalidateQueries({ queryKey: createMateriaPrimaListQueryOptions().queryKey });
        await queryClient.invalidateQueries({
          queryKey: createMateriaPrimaListPKQueryOptions(materiaprimaId).queryKey,
        });
        handleClose();
      }
    },
  });
};

export const useActivateLoteMateriaPrimaMutation = (
  materiaPrimaId: number | undefined,
  handleClose: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => handleActivateLoteMateriaPrima(id),
    onSuccess: () => {
      handleClose();
      if (materiaPrimaId) {
        queryClient.invalidateQueries({
          queryKey:
            createLotesMateriaPrimaQueryOptions(materiaPrimaId).queryKey,
        });
      }
      queryClient.invalidateQueries({ queryKey: createMateriaPrimaListQueryOptions().queryKey });
    },
  });
};

export const useInactivateLoteMateriaPrimaMutation = (
  materiaPrimaId: number | undefined,
  handleClose: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => handleInactivateLoteMateriaPrima(id),
    onSuccess: () => {
      handleClose();
      if (materiaPrimaId) {
        queryClient.invalidateQueries({
          queryKey:
            createLotesMateriaPrimaQueryOptions(materiaPrimaId).queryKey,
        });
        queryClient.invalidateQueries({ queryKey: createMateriaPrimaListQueryOptions().queryKey });
      }
    },
  });
};

export const useCreateUpdateLoteMateriaPrimaMutation = (
  materiaprimaId: number | undefined,
  onSubmitSuccess: () => void,
  reset: () => void,
  isUpdate?: boolean,
  initialDataId?: number | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoteMateriaPrimaFormSumit) =>
      handleCreateUpdateLoteMateriaPrima(
        data,
        isUpdate ? initialDataId : undefined,
      ),
    onSuccess: async () => {
      reset();
      onSubmitSuccess();
      await queryClient.invalidateQueries({
        queryKey: createLotesMateriaPrimaQueryOptions(materiaprimaId!).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: createMateriaPrimaListQueryOptions().queryKey,
      });
    },
  });
};


export const useImportCSVMutationMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: string) => uploadCSV(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: createMateriaPrimaListQueryOptions().queryKey,
      });
    },
  })
}