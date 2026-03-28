import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { buildApiRoutes } from "./db/router";

const server = fastify();

server.register(jwt, {
  secret: "ArcticLegoHuskySquaredle",
});

server.register(cors);

server.register(buildApiRoutes, { prefix: "/api" });

server.listen(
  {
    host: "0.0.0.0",
    port: 7231,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Started server at ${address}`);
  }
);
