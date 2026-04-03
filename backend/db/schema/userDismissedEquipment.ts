import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userDismissedEquipment = sqliteTable("user_dismissed_equipment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.username),
  equipmentType: text("equipment_type").notNull(), // e.g., "barbell", "cable", "bands"
  dismissedAt: text("dismissed_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type UserDismissedEquipment = typeof userDismissedEquipment.$inferSelect;
export type InsertUserDismissedEquipment = typeof userDismissedEquipment.$inferInsert;
