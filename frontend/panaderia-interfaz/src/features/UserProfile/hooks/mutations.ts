import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  updateUserProfile,
  type UpdateUserProfilePayload,
  changePassword,
  type ChangePasswordPayload,
} from "../api/api";
import { useToast } from "@/features/PuntoDeVenta/hooks/use-toast";

export const useUpdateProfileMutation = () => {
  const { updateUser, user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserProfilePayload) => updateUserProfile(data),
    onSuccess: (updatedUser) => {
      // Keep any other user fields from the current auth state
      updateUser({
        ...(user ?? {}),
        ...updatedUser,
      });
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil se ha guardado correctamente.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data ||
        "No se pudo actualizar el perfil.";

      const description = Array.isArray(detail) ? detail.join(" ") : String(detail);

      toast({
        title: "Error al actualizar el perfil",
        description,
        variant: "destructive",
      });
    },
  });
};

export const useChangePasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha cambiado correctamente.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data ||
        "No se pudo cambiar la contraseña.";

      const description = Array.isArray(detail) ? detail.join(" ") : String(detail);

      toast({
        title: "Error al cambiar la contraseña",
        description,
        variant: "destructive",
      });
    },
  });
};