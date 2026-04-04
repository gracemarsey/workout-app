import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { buildApiRoutes } from "./db/router";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const server = fastify();

server.register(jwt, {
  secret: "ArcticLegoHuskySquaredle",
});

// Enable CORS for mobile access
server.register(cors, {
  origin: [
    "http://workout.tombrace.co.uk",
    "https://workout.tombrace.co.uk",
    "http://localhost:9204",
  ],
  credentials: true,
});

// Ensure demo user exists
async function ensureDemoUser() {
  const existing = db
    .select()
    .from(users)
    .where(eq(users.username, "demo_user"))
    .get();
  if (!existing) {
    db.insert(users)
      .values({
        username: "demo_user",
        password: "demo_password",
      })
      .run();
    console.log("Created demo_user");
  }
}

server.register(buildApiRoutes, { prefix: "/api" });

// Initialize database before starting server
ensureDemoUser().then(() => {
  server.listen(
    {
      host: "0.0.0.0",
      port: 9205,
    },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Started server at ${address}`);
    }
  );
});
