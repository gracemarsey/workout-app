import { useQuery } from "react-query";
import { apiRequest } from "./utils";

export type User = {
  id: number;
  name: string;
};

export const getUser = async (username: string) => {
  return apiRequest<User>(`/users/${username}`, {
    method: "GET",
  });
};

export const useGetUser = (username: string) => {
  const { data } = useQuery(["users", { username }], () => getUser(username));

  return data;
};
