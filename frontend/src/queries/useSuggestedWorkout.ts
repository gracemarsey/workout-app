import { useQuery } from "react-query";
import { apiRequest } from "./utils";
import { SuggestedWorkout } from "./types";

export const useSuggestedWorkout = (userId: string | null) => {
  return useQuery<SuggestedWorkout | null>({
    queryKey: ["suggestedWorkout", userId],
    queryFn: () => apiRequest<SuggestedWorkout>(`/progress/suggestion?userId=${userId}`),
    enabled: !!userId,
  });
};
