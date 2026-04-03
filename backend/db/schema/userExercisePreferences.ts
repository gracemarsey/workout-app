import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userExercisePreferences = sqliteTable("user_exercise_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.username),
  exerciseId: text("exercise_id").notNull(), // from free-exercise-db
  preferredReps: integer("preferred_reps").notNull().default(10),
  preferredWeight: integer("preferred_weight").notNull().default(0),
  lastUsed: integer("last_used", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type UserExercisePreference = typeof userExercisePreferences.$inferSelect;
export type InsertUserExercisePreference = typeof userExercisePreferences.$inferInsert;
