import { useQuery } from "react-query";
import { apiRequest } from "./utils";

export interface WorkoutHistoryItem {
  id: string;
  date: string;
  type: "upper" | "lower" | "full";
  duration: number | null;
  location: string;
}

export const useWorkoutHistory = (userId: string, limit: number = 10) => {
  return useQuery(
    ["workoutHistory", userId, limit],
    () => apiRequest<WorkoutHistoryItem[]>(`/progress/history?userId=${userId}&limit=${limit}`),
    { 
      enabled: !!userId,
      refetchOnMount: true,
      staleTime: 0,
    }
  );
};
