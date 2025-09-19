import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { handleRegister } from "../../api/api";
import type {
  TLoginUserSchema,
  TRegisterUserSchema,
} from "../../schemas/schemas";
import { useNavigate } from "react-router-dom";
import type { UseFormSetError } from "react-hook-form";
import { translateApiError } from "@/data/translations";

export const useLoginMutation = (
  setError: UseFormSetError<TLoginUserSchema>,
) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: TLoginUserSchema) => login(data),
    onError: (error: Error) => {
      setError("password", { message: error.message });
    },
  });
};

export const useRegisterMutation = (
  setError: UseFormSetError<TRegisterUserSchema>,
) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: TRegisterUserSchema) => handleRegister(data),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (errorData: Record<string, string[]>) => {
      for (const fieldName in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, fieldName)) {
          const errorMessages = errorData[fieldName];

          if (Array.isArray(errorMessages) && errorMessages.length > 0) {
            const message = translateApiError(errorMessages[0]);
            setError(fieldName as keyof TRegisterUserSchema, { message });
          }
        }
      }
    },
  });
};
