import { db } from "../index";
import {
  completedWorkouts,
  userExercisePreferences,
  userDismissedEquipment,
  CompletedExercise,
} from "../schema";
import { eq, and, gte } from "drizzle-orm";
import {
  getExercisesForWorkout,
  getExerciseWithImages,
  getReplacementExercise,
  getExerciseById,
  type Exercise,
} from "./exercises";
import { WorkoutType, Location } from "./exerciseTypes";
import { WorkoutType as WorkoutTypeEnum } from "../schema/completedWorkouts";

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  reps: number;
  weight: number;
  imageUrls: string[];
  instructions: string[];
  equipment: string;
  completed: boolean;
  isWarmup?: boolean;
  isCooldown?: boolean;
}

export interface GeneratedWorkout {
  id: string;
  type: WorkoutType;
  location: Location;
  exercises: WorkoutExercise[];
  weekNumber: number;
  cycleNumber: number;
}

// Warmup exercises
const WARMUP_EXERCISES: Omit<WorkoutExercise, "completed">[] = [
  {
    exerciseId: "warmup_jumping_jacks",
    name: "Jumping Jacks",
    reps: 30,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isWarmup: true,
  },
  {
    exerciseId: "warmup_arm_circles",
    name: "Arm Circles",
    reps: 20,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isWarmup: true,
  },
  {
    exerciseId: "warmup_leg_swings",
    name: "Leg Swings",
    reps: 10,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isWarmup: true,
  },
  {
    exerciseId: "warmup_bodyweight_squats",
    name: "Bodyweight Squats (Warmup)",
    reps: 15,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isWarmup: true,
  },
];

// Cooldown exercises
const COOLDOWN_EXERCISES: Omit<WorkoutExercise, "completed">[] = [
  {
    exerciseId: "cooldown_childs_pose",
    name: "Child's Pose",
    reps: 30,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isCooldown: true,
  },
  {
    exerciseId: "cooldown_standing_quad_stretch",
    name: "Standing Quad Stretch",
    reps: 30,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isCooldown: true,
  },
  {
    exerciseId: "cooldown_hamstring_stretch",
    name: "Standing Hamstring Stretch",
    reps: 30,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isCooldown: true,
  },
  {
    exerciseId: "cooldown_chest_opener",
    name: "Chest Opener Stretch",
    reps: 30,
    weight: 0,
    imageUrls: [],
    instructions: [],
    equipment: "body only",
    isCooldown: true,
  },
];

// Get the start of the current week (Monday)
export function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get week number within a 4-week cycle
export function getWeekInCycle(currentCycle: number): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7
  );
  return ((weekNumber - 1) % 4) + 1;
}

// Get exercises used in the last N weeks for a workout type
async function getRecentExerciseIds(
  userId: string,
  workoutType: WorkoutType,
  weeksBack: number = 2
): Promise<string[]> {
  const weekStart = getWeekStart();
  const cutoffDate = new Date(weekStart);
  cutoffDate.setDate(cutoffDate.getDate() - weeksBack * 7);

  const recentWorkouts = db
    .select({ exercises: completedWorkouts.exercises })
    .from(completedWorkouts)
    .where(
      and(
        eq(completedWorkouts.userId, userId),
        eq(completedWorkouts.workoutType, workoutType as WorkoutTypeEnum),
        gte(completedWorkouts.date, cutoffDate.toISOString())
      )
    )
    .all();

  const exerciseIds: string[] = [];
  for (const workout of recentWorkouts) {
    if (workout.exercises) {
      for (const exercise of workout.exercises as CompletedExercise[]) {
        if (!exerciseIds.includes(exercise.exerciseId)) {
          exerciseIds.push(exercise.exerciseId);
        }
      }
    }
  }

  return exerciseIds;
}

// Get user's dismissed equipment types
async function getDismissedEquipment(userId: string): Promise<string[]> {
  const dismissed = db
    .select({ equipmentType: userDismissedEquipment.equipmentType })
    .from(userDismissedEquipment)
    .where(eq(userDismissedEquipment.userId, userId))
    .all();

  return dismissed.map((d) => d.equipmentType);
}

// Get user's preferred reps and weight for an exercise
async function getExercisePreferences(
  userId: string,
  exerciseId: string
): Promise<{ reps: number; weight: number }> {
  const pref = db
    .select()
    .from(userExercisePreferences)
    .where(
      and(
        eq(userExercisePreferences.userId, userId),
        eq(userExercisePreferences.exerciseId, exerciseId)
      )
    )
    .get();

  if (pref) {
    return { reps: pref.preferredReps, weight: pref.preferredWeight };
  }

  // Default values
  return { reps: 10, weight: 10 };
}

// Calculate progressive overload for week 4+
function calculateProgressiveOverload(
  baseReps: number,
  baseWeight: number,
  weekInCycle: number,
  cycleNumber: number
): { reps: number; weight: number } {
  if (weekInCycle < 4 && cycleNumber === 1) {
    return { reps: baseReps, weight: baseWeight };
  }

  // Every 4 weeks, increase weight by 5-10% or add reps
  const progressCycles = cycleNumber > 1 ? cycleNumber - 1 : 0;
  const totalWeeks = (progressCycles - 1) * 4 + weekInCycle;

  if (totalWeeks >= 4) {
    const increaseFactor = 1 + (totalWeeks / 4) * 0.05; // 5% per 4-week cycle
    const newWeight = Math.round(baseWeight * increaseFactor);

    // If weight increased, slightly reduce reps to compensate
    const newReps =
      newWeight > baseWeight ? Math.max(baseReps - 2, baseReps - 1) : baseReps;

    return { reps: newReps, weight: newWeight };
  }

  return { reps: baseReps, weight: baseWeight };
}

// Generate a workout with variety
export async function generateWorkout(
  userId: string,
  workoutType: WorkoutType,
  location: Location,
  cycleNumber: number = 1
): Promise<GeneratedWorkout> {
  const weekInCycle = getWeekInCycle(cycleNumber);

  // Get recent exercises to exclude
  const recentExerciseIds = await getRecentExerciseIds(userId, workoutType, 2);

  // Get dismissed equipment
  const dismissedEquipment = await getDismissedEquipment(userId);

  // Get available exercises
  let availableExercises = getExercisesForWorkout(
    workoutType,
    location,
    recentExerciseIds
  );

  // Filter out dismissed equipment
  if (dismissedEquipment.length > 0) {
    availableExercises = availableExercises.filter(
      (e) => !dismissedEquipment.includes(e.equipment as string)
    );
  }

  // Select random exercises for the workout (5-8 exercises)
  const exerciseCount = Math.floor(Math.random() * 4) + 5; // 5-8
  const selectedExercises: Exercise[] = [];

  while (selectedExercises.length < exerciseCount && availableExercises.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    const exercise = availableExercises.splice(randomIndex, 1)[0];
    selectedExercises.push(exercise);
  }

  // Build workout exercises with reps and weights
  const mainExercises: WorkoutExercise[] = await Promise.all(
    selectedExercises.map(async (exercise) => {
      const prefs = await getExercisePreferences(userId, exercise.id);
      const progressive = calculateProgressiveOverload(
        prefs.reps,
        prefs.weight,
        weekInCycle,
        cycleNumber
      );

      const exerciseWithImages = getExerciseWithImages(exercise);

      return {
        exerciseId: exercise.id,
        name: exercise.name,
        reps: progressive.reps,
        weight: progressive.weight,
        imageUrls: exerciseWithImages.imageUrls,
        instructions: exercise.instructions,
        equipment: exercise.equipment || "body only",
        completed: false,
      };
    })
  );

  // Select 2 random warmup exercises
  const warmupCount = 2;
  const shuffledWarmups = [...WARMUP_EXERCISES].sort(() => Math.random() - 0.5);
  const selectedWarmups = shuffledWarmups.slice(0, warmupCount).map((ex) => ({
    ...ex,
    completed: false,
  }));

  // Select 2 random cooldown exercises
  const cooldownCount = 2;
  const shuffledCooldowns = [...COOLDOWN_EXERCISES].sort(() => Math.random() - 0.5);
  const selectedCooldowns = shuffledCooldowns.slice(0, cooldownCount).map((ex) => ({
    ...ex,
    completed: false,
  }));

  // Combine: warmups + main exercises + cooldowns
  const allExercises: WorkoutExercise[] = [
    ...selectedWarmups,
    ...mainExercises,
    ...selectedCooldowns,
  ];

  return {
    id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: workoutType,
    location,
    exercises: allExercises,
    weekNumber: weekInCycle,
    cycleNumber,
  };
}

// Get a replacement exercise after dismissal
export function generateReplacementExercise(
  originalExercise: WorkoutExercise,
  location: Location,
  excludeIds: string[],
  excludeEquipment: string[] = []
): WorkoutExercise | null {
  // Don't try to replace warmup/cooldown exercises
  if (originalExercise.isWarmup || originalExercise.isCooldown) {
    return null;
  }

  // First get the actual exercise data to access primary muscles
  const originalExerciseData = getExerciseById(originalExercise.exerciseId);
  
  if (!originalExerciseData) {
    return null;
  }
  
  const replacement = getReplacementExercise(
    {
      id: originalExercise.exerciseId,
      name: originalExercise.name,
      force: originalExerciseData.force,
      level: originalExerciseData.level,
      mechanic: originalExerciseData.mechanic,
      equipment: originalExercise.equipment as any,
      primaryMuscles: originalExerciseData.primaryMuscles,
      secondaryMuscles: originalExerciseData.secondaryMuscles,
      instructions: originalExerciseData.instructions,
      category: originalExerciseData.category,
      images: originalExerciseData.images,
    },
    location,
    excludeIds,
    excludeEquipment
  );

  if (!replacement) {
    return null;
  }

  const exerciseWithImages = getExerciseWithImages(replacement);

  return {
    exerciseId: replacement.id,
    name: replacement.name,
    reps: originalExercise.reps,
    weight: originalExercise.weight,
    imageUrls: exerciseWithImages.imageUrls,
    instructions: replacement.instructions,
    equipment: replacement.equipment || "body only",
    completed: false,
  };
}
