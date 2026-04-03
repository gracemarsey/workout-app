import { useMutation } from "react-query";
import { apiRequest } from "./utils";
import { GeneratedWorkout } from "./types";

interface GenerateWorkoutParams {
  userId: string;
  type: "upper" | "lower" | "full";
  location: "home" | "gym";
}

export const useGenerateWorkout = () => {
  return useMutation({
    mutationFn: (params: GenerateWorkoutParams) =>
      apiRequest<GeneratedWorkout>("/workouts/generate", {
        method: "POST",
        data: params,
      }),
  });
};
