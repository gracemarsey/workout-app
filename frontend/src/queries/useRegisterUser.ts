import { useMutation } from "react-query";
import axios from "axios";
import { apiRequest } from "./utils";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const registerUser = async ({ username, password }: LoginRequest) => {
  return apiRequest<LoginResponse>("/users/register", {
    method: "POST",
    data: {
      username,
      password,
    },
  });
};

export const useRegisterUser = () => {
  const { mutate, isLoading, isError, data } = useMutation(registerUser);
  return { data, register: mutate, isLoading, isError };
};
