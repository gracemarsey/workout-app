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
  getStretchingExercises,
  getBalancedExercises,
  type Exercise,
} from "./exercises";
import { 
  WorkoutType, 
  Location, 
  BALANCED_WORKOUT_MUSCLES, 
  WORKOUT_STRETCHES,
  Muscle 
} from "./exerciseTypes";
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
  isStretch?: boolean;
  targetMuscle?: Muscle;
}

export interface GeneratedWorkout {
  id: string;
  type: WorkoutType;
  location: Location;
  exercises: WorkoutExercise[];
  stretches: WorkoutExercise[];
  weekNumber: number;
  cycleNumber: number;
}

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

// Generate a workout with balanced muscle distribution
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

  // Get balanced exercises for the workout type
  const balancedTargets = BALANCED_WORKOUT_MUSCLES[workoutType];
  let availableExercises = getBalancedExercises(
    workoutType,
    location,
    recentExerciseIds,
    dismissedEquipment
  );

  // Select 6-8 exercises for a balanced workout
  const exerciseCount = Math.floor(Math.random() * 3) + 6; // 6-8 exercises
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
        targetMuscle: exercise.primaryMuscles[0],
      };
    })
  );

  // Generate 2-3 targeted stretches based on workout type
  const stretchTemplates = WORKOUT_STRETCHES[workoutType];
  const stretchCount = Math.floor(Math.random() * 2) + 2; // 2-3 stretches
  const shuffledStretches = [...stretchTemplates].sort(() => Math.random() - 0.5);
  const selectedStretchTemplates = shuffledStretches.slice(0, stretchCount);

  const stretches: WorkoutExercise[] = selectedStretchTemplates.map((stretch) => ({
    exerciseId: `stretch_${stretch.name.toLowerCase().replace(/\s+/g, "_")}`,
    name: stretch.name,
    reps: 1,
    weight: 0,
    imageUrls: [],
    instructions: [`Hold stretch for ${stretch.duration} seconds on each side`],
    equipment: "body only",
    completed: false,
    isStretch: true,
    targetMuscle: stretch.targetMuscle,
  }));

  return {
    id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: workoutType,
    location,
    exercises: mainExercises,
    stretches,
    weekNumber: weekInCycle,
    cycleNumber,
  };
}

// Get a replacement exercise after dismissal - maintains workout balance
export function generateReplacementExercise(
  originalExercise: WorkoutExercise,
  location: Location,
  currentWorkoutExercises: WorkoutExercise[],
  excludeIds: string[] = [],
  excludeEquipment: string[] = []
): WorkoutExercise | null {
  // Don't try to replace stretch exercises
  if (originalExercise.isStretch) {
    return null;
  }

  // First get the actual exercise data to access primary muscles
  const originalExerciseData = getExerciseById(originalExercise.exerciseId);
  
  if (!originalExerciseData) {
    return null;
  }
  
  // Get current muscle coverage in the workout to maintain balance
  const muscleCoverage = new Map<Muscle, number>();
  for (const ex of currentWorkoutExercises) {
    if (ex.isStretch) continue;
    const exData = getExerciseById(ex.exerciseId);
    if (exData) {
      for (const muscle of exData.primaryMuscles) {
        muscleCoverage.set(muscle, (muscleCoverage.get(muscle) || 0) + 1);
      }
    }
  }

  // Check if the original muscle group would become under-represented
  const originalMuscleCount = muscleCoverage.get(originalExerciseData.primaryMuscles[0]) || 0;
  const needsSameMuscleGroup = originalMuscleCount <= 1;

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
    excludeEquipment,
    needsSameMuscleGroup ? originalExerciseData.primaryMuscles : undefined
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
    targetMuscle: replacement.primaryMuscles[0],
  };
}
