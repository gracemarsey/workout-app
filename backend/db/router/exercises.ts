import { Router } from "./types";
import {
  getAllExercises,
  getExerciseById,
  getExerciseWithImages,
  filterExercisesByLocation,
} from "../services/exercises";

export const buildExerciseRoutes: Router = (fastify, _, done) => {
  // List all exercises (optionally filtered)
  fastify.get<{
    Querystring: { location?: "home" | "gym" };
  }>("/", async (request, reply) => {
    const { location } = request.query;

    try {
      let exercises;

      if (location) {
        exercises = filterExercisesByLocation(location);
      } else {
        exercises = getAllExercises();
      }

      // Add image URLs to each exercise
      const exercisesWithImages = exercises.map(getExerciseWithImages);

      return reply.send({
        count: exercisesWithImages.length,
        exercises: exercisesWithImages,
      });
    } catch (error) {
      console.error("Error listing exercises:", error);
      return reply.status(500).send({ error: "Failed to list exercises" });
    }
  });

  // Get single exercise by ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    async (request, reply) => {
      const { id } = request.params;

      try {
        const exercise = getExerciseById(id);

        if (!exercise) {
          return reply.status(404).send({ error: "Exercise not found" });
        }

        const exerciseWithImages = getExerciseWithImages(exercise);
        return reply.send(exerciseWithImages);
      } catch (error) {
        console.error("Error getting exercise:", error);
        return reply.status(500).send({ error: "Failed to get exercise" });
      }
    }
  );

  done();
};
