import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "./utils";
import { WorkoutExercise } from "./types";

interface CompleteWorkoutParams {
  userId: string;
  workoutId: string;
  type: "upper" | "lower" | "full";
  location: "home" | "gym";
  durationMinutes: number;
  exercises: WorkoutExercise[];
}

export const useCompleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CompleteWorkoutParams) =>
      apiRequest("/workouts/complete", {
        method: "POST",
        data: params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeklyProgress"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedWorkout"] });
      queryClient.invalidateQueries({ queryKey: ["workoutHistory"] });
      queryClient.refetchQueries({ queryKey: ["workoutHistory"] });
    },
  });
};
