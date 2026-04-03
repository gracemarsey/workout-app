import { useQuery } from "react-query";
import { apiRequest } from "./utils";
import { WeeklyProgress } from "./types";

export const useWeeklyProgress = (userId: string) => {
  return useQuery(
    ["weeklyProgress", userId],
    () => apiRequest<WeeklyProgress>(`/progress/weekly?userId=${userId}`),
    { enabled: !!userId }
  );
};
