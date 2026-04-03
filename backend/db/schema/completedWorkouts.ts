import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const workoutTypes = ["upper", "lower", "full"] as const;
export type WorkoutType = (typeof workoutTypes)[number];

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export const completedWorkouts = sqliteTable("completed_workouts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.username),
  workoutType: text("workout_type", { enum: workoutTypes }).notNull(),
  location: text("location", { enum: ["home", "gym"] }).notNull(),
  date: text("date").notNull(), // ISO date string
  durationMinutes: integer("duration_minutes"),
  exercises: text("exercises", { mode: "json" }).$type<CompletedExercise[]>(),
  completedAt: text("completed_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type InsertCompletedWorkout = typeof completedWorkouts.$inferInsert;
