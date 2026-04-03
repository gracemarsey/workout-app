import { db } from "../index";
import {
  completedWorkouts,
  WorkoutType,
  CompletedExercise,
} from "../schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { WorkoutType as WorkoutTypeEnum } from "../schema/completedWorkouts";

export interface WeeklyProgress {
  total: number;
  upper: boolean;
  lower: boolean;
  full: boolean;
}

export interface SuggestedWorkout {
  type: WorkoutType;
  reason: string;
}

// Get the start of the current week (Monday)
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get the end of the current week (Sunday 23:59:59)
function getWeekEnd(): Date {
  const weekStart = getWeekStart();
  const sunday = new Date(weekStart);
  sunday.setDate(sunday.getDate() + 7);
  return sunday;
}

export async function getWeeklyProgress(
  userId: string
): Promise<WeeklyProgress> {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  const workouts = db
    .select({
      workoutType: completedWorkouts.workoutType,
    })
    .from(completedWorkouts)
    .where(
      and(
        eq(completedWorkouts.userId, userId),
        gte(completedWorkouts.date, weekStart.toISOString()),
        lt(completedWorkouts.date, weekEnd.toISOString())
      )
    )
    .all();

  const completedTypes = new Set(
    workouts.map((w) => w.workoutType as WorkoutType)
  );

  return {
    total: workouts.length,
    upper: completedTypes.has("upper"),
    lower: completedTypes.has("lower"),
    full: completedTypes.has("full"),
  };
}

export async function getSuggestedWorkout(
  userId: string
): Promise<SuggestedWorkout | null> {
  const progress = await getWeeklyProgress(userId);

  // All three workouts completed
  if (progress.upper && progress.lower && progress.full) {
    return null; // No suggestion needed
  }

  // Suggest the workout type that's not been done yet
  if (!progress.upper) {
    return { type: "upper", reason: "Start your week with an upper body workout" };
  }
  if (!progress.lower) {
    return { type: "lower", reason: "Time for lower body strength" };
  }
  if (!progress.full) {
    return { type: "full", reason: "Finish the week with a full body workout" };
  }

  // Fallback to random
  const types: WorkoutType[] = ["upper", "lower", "full"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return { type: randomType, reason: "Keep up the momentum!" };
}

// Get workout history for analysis
export async function getWorkoutHistory(
  userId: string,
  limit: number = 8
): Promise<
  Array<{
    id: string;
    date: string;
    type: WorkoutType;
    duration: number | null;
    location: string;
  }>
> {
  const workouts = db
    .select({
      id: completedWorkouts.id,
      date: completedWorkouts.date,
      workoutType: completedWorkouts.workoutType,
      duration: completedWorkouts.durationMinutes,
      location: completedWorkouts.location,
    })
    .from(completedWorkouts)
    .where(eq(completedWorkouts.userId, userId))
    .orderBy(completedWorkouts.completedAt)
    .limit(limit)
    .all();

  return workouts.map((w) => ({
    id: w.id,
    date: w.date,
    type: w.workoutType as WorkoutType,
    duration: w.duration,
    location: w.location,
  }));
}

// Get a specific completed workout by ID
export async function getCompletedWorkoutById(workoutId: string) {
  const workout = db
    .select()
    .from(completedWorkouts)
    .where(eq(completedWorkouts.id, workoutId))
    .get();

  if (!workout) return null;

  return {
    id: workout.id,
    date: workout.date,
    type: workout.workoutType,
    location: workout.location,
    duration: workout.durationMinutes,
    exercises: workout.exercises,
    completedAt: workout.completedAt,
  };
}
