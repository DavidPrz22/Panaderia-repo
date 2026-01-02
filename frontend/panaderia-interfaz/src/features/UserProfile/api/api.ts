import apiClient from "@/api/client";
import type { User } from "@/features/Authentication/types/types";

export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>("/api/users/me/");
  return response.data;
};

export type UpdateUserProfilePayload = Pick<
  User,
  "full_name" | "username" | "email"
>;

export const updateUserProfile = async (
  data: UpdateUserProfilePayload,
): Promise<User> => {
  const response = await apiClient.patch<User>("/api/users/me/", data);
  return response.data;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
};

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<void> => {
  await apiClient.post("/api/users/me/set_password/", data);
};