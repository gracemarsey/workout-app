import { useQuery } from "react-query";
import { apiRequest } from "./utils";
import { WorkoutExercise } from "./types";

export interface CompletedWorkoutDetail {
  id: string;
  date: string;
  type: "upper" | "lower" | "full";
  location: string;
  duration: number | null;
  exercises: WorkoutExercise[];
  completedAt: string;
}

export const useCompletedWorkout = (workoutId: string | null) => {
  return useQuery<CompletedWorkoutDetail | null>({
    queryKey: ["completedWorkout", workoutId],
    queryFn: () => apiRequest<CompletedWorkoutDetail>(`/progress/workout/${workoutId}`),
    enabled: !!workoutId,
  });
};
