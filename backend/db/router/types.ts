import { FastifyInstance } from "fastify";

export type Router = (
  fastify: FastifyInstance,
  opts: {
    prefix: string;
  },
  done: (err?: Error | undefined) => void
) => void;
