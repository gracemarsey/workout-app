import { Router } from "./types";
import { buildUserRoutes } from "./users";

export const buildApiRoutes: Router = (fastify, _, done) => {
  fastify.register(buildUserRoutes, { prefix: "/users" });
  done();
};
