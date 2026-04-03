import exercisesData from "../../../free-exercise-db/dist/exercises.json";
import {
  Exercise,
  Equipment,
  Muscle,
  WorkoutType,
  Location,
  HOME_EQUIPMENT,
  GYM_EQUIPMENT,
  WORKOUT_MUSCLES,
  EXERCISE_IMAGE_BASE,
} from "./exerciseTypes";

// Re-export types for convenience
export type { Exercise, Equipment, Muscle, WorkoutType, Location } from "./exerciseTypes";

// Cache the exercises on module load
let exercisesCache: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!exercisesCache) {
    exercisesCache = exercisesData as Exercise[];
  }
  return exercisesCache;
}

export function getExerciseById(id: string): Exercise | undefined {
  return getAllExercises().find((e) => e.id === id);
}

export function filterExercisesByEquipment(
  equipment: Equipment[]
): Exercise[] {
  return getAllExercises().filter((e) =>
    equipment.includes(e.equipment as Equipment)
  );
}

export function filterExercisesByMuscles(muscles: Muscle[]): Exercise[] {
  return getAllExercises().filter((e) =>
    e.primaryMuscles.some((m) => muscles.includes(m))
  );
}

export function filterExercisesByLocation(location: Location): Exercise[] {
  const allowedEquipment =
    location === "home" ? HOME_EQUIPMENT : GYM_EQUIPMENT;
  return filterExercisesByEquipment(allowedEquipment);
}

export function getExercisesForWorkout(
  workoutType: WorkoutType,
  location: Location,
  excludeIds: string[] = []
): Exercise[] {
  // Filter by location (home or gym equipment)
  let exercises = filterExercisesByLocation(location);

  // Filter by workout type muscle groups
  const targetMuscles = WORKOUT_MUSCLES[workoutType];
  exercises = exercises.filter((e) =>
    e.primaryMuscles.some((m) => targetMuscles.includes(m))
  );

  // Filter out excluded exercises
  if (excludeIds.length > 0) {
    exercises = exercises.filter((e) => !excludeIds.includes(e.id));
  }

  // Filter out cardio-specific exercises (only for strength-focused workouts)
  // unless it's a full body workout where we want some cardio
  if (workoutType !== "full") {
    exercises = exercises.filter((e) => e.category !== "cardio");
  }

  return exercises;
}

export function getExerciseImageUrl(exercise: Exercise, index = 0): string {
  if (exercise.images && exercise.images[index]) {
    return `${EXERCISE_IMAGE_BASE}/${exercise.images[index]}`;
  }
  return "";
}

export function getExerciseWithImages(exercise: Exercise) {
  return {
    ...exercise,
    imageUrls: exercise.images.map(
      (_, i) => `${EXERCISE_IMAGE_BASE}/${exercise.id}/${i}.jpg`
    ),
  };
}

// Get exercises by equipment type (for dismissal handling)
export function getExercisesByEquipment(equipmentType: string): Exercise[] {
  return getAllExercises().filter((e) => e.equipment === equipmentType);
}

// Get replacement exercise from same muscle group, different equipment
export function getReplacementExercise(
  originalExercise: Exercise,
  location: Location,
  excludeIds: string[] = [],
  excludeEquipment: string[] = []
): Exercise | undefined {
  const allowedEquipment =
    location === "home" ? HOME_EQUIPMENT : GYM_EQUIPMENT;

  // Get all exercises
  const allExercises = getAllExercises();

  // Filter by muscle group
  let candidates = allExercises.filter((e) =>
    e.primaryMuscles.some((m) => originalExercise.primaryMuscles.includes(m))
  );

  // Filter by allowed equipment
  candidates = candidates.filter((e) =>
    allowedEquipment.includes(e.equipment as Equipment)
  );

  // Exclude original exercise
  candidates = candidates.filter((e) => e.id !== originalExercise.id);

  // Exclude given IDs
  candidates = candidates.filter((e) => !excludeIds.includes(e.id));

  // If we have excludeEquipment, prefer different equipment
  if (excludeEquipment.length > 0) {
    const withDifferentEquipment = candidates.filter(
      (e) => !excludeEquipment.includes(e.equipment || "")
    );
    if (withDifferentEquipment.length > 0) {
      candidates = withDifferentEquipment;
    }
  }

  if (candidates.length === 0) {
    return undefined;
  }

  // Return a random replacement
  return candidates[Math.floor(Math.random() * candidates.length)];
}
