import exercisesData from "../../../exercise-data/exercises.json";
import {
  Exercise,
  Equipment,
  Muscle,
  WorkoutType,
  Location,
  HOME_EQUIPMENT,
  GYM_EQUIPMENT,
  WORKOUT_MUSCLES,
  BALANCED_WORKOUT_MUSCLES,
  EXERCISE_IMAGE_BASE,
} from "./exerciseTypes";

// Re-export types for convenience
export type {
  Exercise,
  Equipment,
  Muscle,
  WorkoutType,
  Location,
} from "./exerciseTypes";

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

export function filterExercisesByEquipment(equipment: Equipment[]): Exercise[] {
  return getAllExercises().filter((e) =>
    equipment.includes(e.equipment as Equipment),
  );
}

export function filterExercisesByMuscles(muscles: Muscle[]): Exercise[] {
  return getAllExercises().filter((e) =>
    e.primaryMuscles.some((m) => muscles.includes(m)),
  );
}

export function filterExercisesByLocation(location: Location): Exercise[] {
  const allowedEquipment = location === "home" ? HOME_EQUIPMENT : GYM_EQUIPMENT;
  return filterExercisesByEquipment(allowedEquipment);
}

export function getExercisesForWorkout(
  workoutType: WorkoutType,
  location: Location,
  excludeIds: string[] = [],
): Exercise[] {
  // Filter by location (home or gym equipment)
  let exercises = filterExercisesByLocation(location);

  // Filter by workout type muscle groups
  const targetMuscles = WORKOUT_MUSCLES[workoutType];
  exercises = exercises.filter((e) =>
    e.primaryMuscles.some((m) => targetMuscles.includes(m)),
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

// Get stretching exercises for a specific muscle group
export function getStretchingExercises(targetMuscle: Muscle): Exercise[] {
  return getAllExercises().filter((e) =>
    e.category === "stretching" && e.primaryMuscles.includes(targetMuscle)
  );
}

// Get balanced exercises ensuring all major muscle groups are represented
export function getBalancedExercises(
  workoutType: WorkoutType,
  location: Location,
  excludeIds: string[] = [],
  dismissedEquipment: string[] = []
): Exercise[] {
  const balancedTargets = BALANCED_WORKOUT_MUSCLES[workoutType];
  const primaryMuscles = balancedTargets.primary;
  
  // Filter by location
  let exercises = filterExercisesByLocation(location);
  
  // Filter by workout type muscle groups
  exercises = exercises.filter((e) =>
    e.primaryMuscles.some((m) => primaryMuscles.includes(m)),
  );
  
  // Filter out excluded exercises
  if (excludeIds.length > 0) {
    exercises = exercises.filter((e) => !excludeIds.includes(e.id));
  }
  
  // Filter out dismissed equipment
  if (dismissedEquipment.length > 0) {
    exercises = exercises.filter(
      (e) => !dismissedEquipment.includes(e.equipment as string)
    );
  }
  
  // Filter out cardio (except for full body)
  if (workoutType !== "full") {
    exercises = exercises.filter((e) => e.category !== "cardio");
  }
  
  // Group exercises by primary muscle
  const exercisesByMuscle = new Map<Muscle, Exercise[]>();
  for (const muscle of primaryMuscles) {
    exercisesByMuscle.set(
      muscle,
      exercises.filter((e) => e.primaryMuscles.includes(muscle))
    );
  }
  
  const result: Exercise[] = [];
  
  // Determine target counts per muscle group based on workout type
  const targetCounts = getTargetMuscleCounts(workoutType);
  
  for (const [muscle, count] of Object.entries(targetCounts)) {
    const muscleExercises = exercisesByMuscle.get(muscle as Muscle) || [];
    // Shuffle and take the required number (or fewer if not enough available)
    const shuffled = muscleExercises.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.max(count, 1)); // At least 1 if available
    result.push(...selected);
  }
  
  // If we don't have enough exercises, add more from available pool
  const minExercises = workoutType === "lower" ? 5 : 6;
  if (result.length < minExercises) {
    const usedIds = new Set(result.map(e => e.id));
    const additionalExercises = exercises
      .filter(e => !usedIds.has(e.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, minExercises - result.length);
    result.push(...additionalExercises);
  }
  
  // Shuffle the final result to randomize order
  return result.sort(() => Math.random() - 0.5);
}

// Get target exercise counts per muscle group for balanced workouts
function getTargetMuscleCounts(workoutType: WorkoutType): Record<string, number> {
  switch (workoutType) {
    case "upper":
      // Push/pull balance: chest+shoulders+triceps (push) vs lats+biceps (pull)
      return {
        chest: 1,
        lats: 1,
        shoulders: 1,
        biceps: 1,
        triceps: 1,
        "middle back": 0, // secondary, not targeted
      };
    case "lower":
      // Balanced leg workout
      return {
        quadriceps: 2,
        hamstrings: 1,
        glutes: 1,
        calves: 1,
      };
    case "full":
      // Full body - all major groups
      return {
        chest: 1,
        lats: 1,
        shoulders: 1,
        biceps: 1,
        triceps: 1,
        quadriceps: 1,
        hamstrings: 1,
        glutes: 1,
        abdominals: 1,
      };
    default:
      return {};
  }
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
      (_, i) => `${EXERCISE_IMAGE_BASE}/${exercise.id}/${i}.jpg`,
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
  excludeEquipment: string[] = [],
  requiredMuscles?: Muscle[],
): Exercise | undefined {
  const allowedEquipment = location === "home" ? HOME_EQUIPMENT : GYM_EQUIPMENT;

  // Get all exercises
  const allExercises = getAllExercises();

  // Filter by required muscles (for maintaining balance) or original exercise's muscles
  const targetMuscles = requiredMuscles || originalExercise.primaryMuscles;
  let candidates = allExercises.filter((e) =>
    e.primaryMuscles.some((m) => targetMuscles.includes(m)),
  );

  // Filter by allowed equipment
  candidates = candidates.filter((e) =>
    allowedEquipment.includes(e.equipment as Equipment),
  );

  // Exclude original exercise
  candidates = candidates.filter((e) => e.id !== originalExercise.id);

  // Exclude given IDs
  candidates = candidates.filter((e) => !excludeIds.includes(e.id));

  // Prefer different equipment if possible (for variety)
  if (excludeEquipment.length > 0) {
    const withDifferentEquipment = candidates.filter(
      (e) => !excludeEquipment.includes(e.equipment || ""),
    );
    if (withDifferentEquipment.length > 0) {
      candidates = withDifferentEquipment;
    }
  }

  // Filter out cardio exercises for strength workouts
  candidates = candidates.filter((e) => e.category !== "cardio");

  if (candidates.length === 0) {
    return undefined;
  }

  // Return a random replacement
  return candidates[Math.floor(Math.random() * candidates.length)];
}
