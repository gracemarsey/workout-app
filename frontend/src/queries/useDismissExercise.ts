import { useMutation } from "react-query";
import { apiRequest } from "./utils";
import { WorkoutExercise, DismissResponse } from "./types";

interface DismissExerciseParams {
  userId: string;
  exercise: WorkoutExercise;
  reason: "not_available" | "dont_feel_like_it";
  location: "home" | "gym";
  currentWorkoutExercises?: WorkoutExercise[];
}

export const useDismissExercise = () => {
  return useMutation({
    mutationFn: (params: DismissExerciseParams) =>
      apiRequest<DismissResponse>("/workouts/dismiss", {
        method: "POST",
        data: params,
      }),
  });
};
