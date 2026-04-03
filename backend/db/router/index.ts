import { Router } from "./types";
import { buildUserRoutes } from "./users";
import { buildWorkoutRoutes } from "./workouts";
import { buildProgressRoutes } from "./progress";
import { buildExerciseRoutes } from "./exercises";

export const buildApiRoutes: Router = (fastify, _, done) => {
  fastify.register(buildUserRoutes, { prefix: "/users" });
  fastify.register(buildWorkoutRoutes, { prefix: "/workouts" });
  fastify.register(buildProgressRoutes, { prefix: "/progress" });
  fastify.register(buildExerciseRoutes, { prefix: "/exercises" });
  done();
};
