import { Router } from "./types";
import { getWeeklyProgress, getSuggestedWorkout, getWorkoutHistory, getCompletedWorkoutById } from "../services/progress";

export const buildProgressRoutes: Router = (fastify, _, done) => {
  // Get weekly progress
  fastify.get<{ Querystring: { userId: string } }>(
    "/weekly",
    async (request, reply) => {
      const { userId } = request.query;

      if (!userId) {
        return reply.status(400).send({ error: "Missing userId" });
      }

      try {
        const progress = await getWeeklyProgress(userId);
        return reply.send(progress);
      } catch (error) {
        console.error("Error getting weekly progress:", error);
        return reply.status(500).send({ error: "Failed to get weekly progress" });
      }
    }
  );

  // Get suggested workout
  fastify.get<{ Querystring: { userId: string } }>(
    "/suggestion",
    async (request, reply) => {
      const { userId } = request.query;

      if (!userId) {
        return reply.status(400).send({ error: "Missing userId" });
      }

      try {
        const suggestion = await getSuggestedWorkout(userId);
        return reply.send(suggestion);
      } catch (error) {
        console.error("Error getting suggestion:", error);
        return reply.status(500).send({ error: "Failed to get suggestion" });
      }
    }
  );

  // Get workout history
  fastify.get<{ Querystring: { userId: string; limit?: number } }>(
    "/history",
    async (request, reply) => {
      const { userId, limit } = request.query;

      if (!userId) {
        return reply.status(400).send({ error: "Missing userId" });
      }

      try {
        const history = await getWorkoutHistory(userId, limit || 10);
        return reply.send(history);
      } catch (error) {
        console.error("Error getting workout history:", error);
        return reply.status(500).send({ error: "Failed to get workout history" });
      }
    }
  );

  // Get a specific completed workout
  fastify.get<{ Params: { workoutId: string } }>(
    "/workout/:workoutId",
    async (request, reply) => {
      const { workoutId } = request.params;

      if (!workoutId) {
        return reply.status(400).send({ error: "Missing workoutId" });
      }

      try {
        const workout = await getCompletedWorkoutById(workoutId);
        if (!workout) {
          return reply.status(404).send({ error: "Workout not found" });
        }
        return reply.send(workout);
      } catch (error) {
        console.error("Error getting workout:", error);
        return reply.status(500).send({ error: "Failed to get workout" });
      }
    }
  );

  done();
};
