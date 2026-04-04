import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "..";
import {
  completedWorkouts,
  userExercisePreferences,
  userDismissedEquipment,
  InsertCompletedWorkout,
} from "../schema";

// Save a completed workout
export async function saveCompletedWorkout(
  workout: InsertCompletedWorkout
): Promise<void> {
  await db.insert(completedWorkouts).values(workout).execute();
}

// Get user's completed workouts
export function getCompletedWorkouts(userId: string) {
  return db
    .select()
    .from(completedWorkouts)
    .where(eq(completedWorkouts.userId, userId))
    .all();
}

// Update or create exercise preferences
export async function saveExercisePreferences(
  userId: string,
  exerciseId: string,
  reps: number,
  weight: number
): Promise<void> {
  const existing = db
    .select()
    .from(userExercisePreferences)
    .where(
      and(
        eq(userExercisePreferences.userId, userId),
        eq(userExercisePreferences.exerciseId, exerciseId)
      )
    )
    .get();

  if (existing) {
    // Update existing
    await db
      .update(userExercisePreferences)
      .set({
        preferredReps: reps,
        preferredWeight: weight,
        lastUsed: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userExercisePreferences.id, existing.id))
      .execute();
  } else {
    // Insert new
    await db
      .insert(userExercisePreferences)
      .values({
        id: randomUUID(),
        userId,
        exerciseId,
        preferredReps: reps,
        preferredWeight: weight,
        lastUsed: new Date(),
      })
      .execute();
  }
}

// Save dismissed equipment
export async function saveDismissedEquipment(
  userId: string,
  equipmentType: string
): Promise<void> {
  // Check if already dismissed
  const existing = db
    .select()
    .from(userDismissedEquipment)
    .where(
      and(
        eq(userDismissedEquipment.userId, userId),
        eq(userDismissedEquipment.equipmentType, equipmentType)
      )
    )
    .get();

  if (!existing) {
    await db
      .insert(userDismissedEquipment)
      .values({
        id: randomUUID(),
        userId,
        equipmentType,
        dismissedAt: new Date().toISOString(),
      })
      .execute();
  }
}

// Get all dismissed equipment for a user
export function getDismissedEquipment(userId: string): string[] {
  const results = db
    .select({ equipmentType: userDismissedEquipment.equipmentType })
    .from(userDismissedEquipment)
    .where(eq(userDismissedEquipment.userId, userId))
    .all();

  return results.map((r) => r.equipmentType);
}
