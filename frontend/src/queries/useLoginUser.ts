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

export const loginUser = async ({ username, password }: LoginRequest) => {
  return apiRequest<LoginResponse>("/users/login", {
    method: "POST",
    data: {
      username,
      password,
    },
  });
};

export const useLoginUser = () => {
  const { mutate, isLoading, isError, data } = useMutation(loginUser);
  return { data, login: mutate, isLoading, isError };
};
