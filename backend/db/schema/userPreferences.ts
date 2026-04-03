import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userPreferences = sqliteTable("user_preferences", {
  userId: text("user_id")
    .notNull()
    .references(() => users.username),
  location: text("location", { enum: ["home", "gym"] }).notNull().default("gym"),
  currentWeek: integer("current_week").notNull().default(1),
  currentCycle: integer("current_cycle").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
