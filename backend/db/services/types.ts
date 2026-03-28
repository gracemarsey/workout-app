import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

export type ServiceHandler = (
  req: FastifyRequest,
  res: FastifyReply
) => Promise<void>;
