import type { TLoginUserSchema, TRegisterUserSchema } from "../schemas/schemas";
import { API } from "../../../data/constants";

export const handleLogin = async (data: TLoginUserSchema) => {
  const validationResponse = await fetch(
    `${API}/api/users/validate-credentials/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!validationResponse.ok) {
    const errorData = await validationResponse.json();
    throw new Error(errorData.detail);
  }

  const tokenResponse = await fetch(`${API}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    throw new Error(errorData.detail);
  }
  const validationData = await validationResponse.json();
  const tokenData = await tokenResponse.json();
  return { ...tokenData, ...validationData };
};

// REGISTER API CALL
export const handleRegister = async (data: TRegisterUserSchema) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { repeatpassword, ...registerData } = data;
  const response = await fetch(`${API}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const dataResponse = await response.json();
  return dataResponse;
};
