import { FastifyInstance } from "fastify";
import { Router } from "./types";
import {
  generateWorkout,
  generateReplacementExercise,
  WorkoutExercise,
} from "../services/workoutGenerator";
import {
  saveCompletedWorkout,
  saveExercisePreferences,
  saveDismissedEquipment,
} from "../repositories/workouts";
import { WorkoutType as WorkoutTypeEnum } from "../schema/completedWorkouts";
import { v4 as uuidv4 } from "uuid";

interface GenerateWorkoutBody {
  userId: string;
  type: "upper" | "lower" | "full";
  location: "home" | "gym";
}

interface CompleteWorkoutBody {
  userId: string;
  workoutId: string;
  type: "upper" | "lower" | "full";
  location: "home" | "gym";
  durationMinutes: number;
  exercises: WorkoutExercise[];
}

interface DismissExerciseBody {
  userId: string;
  exercise: WorkoutExercise;
  reason: "not_available" | "dont_feel_like_it";
  location: "home" | "gym";
}

interface ReplacementBody {
  exercise: WorkoutExercise;
  location: "home" | "gym";
  excludeIds: string[];
}

export const buildWorkoutRoutes: Router = (fastify: FastifyInstance, _, done) => {
  // Generate a new workout
  fastify.post<{ Body: GenerateWorkoutBody }>(
    "/generate",
    async (request, reply) => {
      const { userId, type, location } = request.body;

      if (!userId || !type || !location) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      try {
        const workout = await generateWorkout(userId, type, location);
        return reply.send(workout);
      } catch (error) {
        console.error("Error generating workout:", error);
        return reply.status(500).send({ error: "Failed to generate workout" });
      }
    }
  );

  // Get replacement exercise
  fastify.post<{ Body: ReplacementBody }>(
    "/replacement",
    async (request, reply) => {
      const { exercise, location, excludeIds } = request.body;

      if (!exercise) {
        return reply.status(400).send({ error: "Missing exercise" });
      }

      try {
        const replacement = generateReplacementExercise(
          exercise,
          location,
          excludeIds
        );

        if (!replacement) {
          return reply.status(404).send({ error: "No replacement found" });
        }

        return reply.send(replacement);
      } catch (error) {
        console.error("Error getting replacement:", error);
        return reply.status(500).send({ error: "Failed to get replacement" });
      }
    }
  );

  // Complete a workout
  fastify.post<{ Body: CompleteWorkoutBody }>(
    "/complete",
    async (request, reply) => {
      const { userId, workoutId, type, location, durationMinutes, exercises } =
        request.body;

      if (!userId || !type || !exercises) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      try {
        // Save the completed workout
        await saveCompletedWorkout({
          id: workoutId || uuidv4(),
          userId,
          workoutType: type as WorkoutTypeEnum,
          location,
          date: new Date().toISOString().split("T")[0],
          durationMinutes,
          exercises: exercises.map((e) => ({
            exerciseId: e.exerciseId,
            name: e.name,
            reps: e.reps,
            weight: e.weight,
            completed: e.completed,
          })),
        });

        // Save exercise preferences for progressive overload
        for (const exercise of exercises) {
          await saveExercisePreferences(
            userId,
            exercise.exerciseId,
            exercise.reps,
            exercise.weight
          );
        }

        return reply.send({ success: true, workoutId });
      } catch (error) {
        console.error("Error completing workout:", error);
        return reply.status(500).send({ error: "Failed to complete workout" });
      }
    }
  );

  // Dismiss an exercise
  fastify.post<{ Body: DismissExerciseBody }>(
    "/dismiss",
    async (request, reply) => {
      const { userId, exercise, reason, location } = request.body;

      if (!userId || !exercise || !reason) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      try {
        if (reason === "not_available") {
          const replacement = generateReplacementExercise(
            exercise,
            location,
            [exercise.exerciseId],
            [exercise.equipment]
          );
          return reply.send({ dismissed: true, reason, replacement });
        } else {
          const replacement = generateReplacementExercise(
            exercise,
            location,
            [exercise.exerciseId],
            []
          );
          return reply.send({ dismissed: true, reason, replacement });
        }
      } catch (error) {
        console.error("Error dismissing exercise:", error);
        return reply.status(500).send({ error: "Failed to dismiss exercise" });
      }
    }
  );

  done();
};
