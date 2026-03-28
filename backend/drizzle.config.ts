import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/index.ts",
  out: "./drizzle",
} satisfies Config;
