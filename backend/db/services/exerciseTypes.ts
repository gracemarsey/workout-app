// Types matching free-exercise-db schema
export type Muscle =
  | "abdominals"
  | "abductors"
  | "adductors"
  | "biceps"
  | "calves"
  | "chest"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "lats"
  | "lower back"
  | "middle back"
  | "neck"
  | "quadriceps"
  | "shoulders"
  | "traps"
  | "triceps";

export type Equipment =
  | "medicine ball"
  | "dumbbell"
  | "body only"
  | "bands"
  | "kettlebells"
  | "foam roll"
  | "cable"
  | "machine"
  | "barbell"
  | "exercise ball"
  | "e-z curl bar"
  | "other"
  | null;

export type Force = "static" | "pull" | "push" | null;
export type Level = "beginner" | "intermediate" | "expert";
export type Mechanic = "isolation" | "compound" | null;
export type Category =
  | "powerlifting"
  | "strength"
  | "stretching"
  | "cardio"
  | "olympic weightlifting"
  | "strongman"
  | "plyometrics";

export interface Exercise {
  id: string;
  name: string;
  force: Force;
  level: Level;
  mechanic: Mechanic;
  equipment: Equipment;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  instructions: string[];
  category: Category;
  images: string[];
}

export type WorkoutType = "upper" | "lower" | "full";
export type Location = "home" | "gym";

// Equipment allowed for home workouts
export const HOME_EQUIPMENT: Equipment[] = ["dumbbell", "bands", "body only"];

// Gym equipment - Your specific gym equipment
// Equipment available: 2 cross trainers, 2 rowing machines, 3 treadmills, 2 stationery bikes,
// 1 stairmaster, 1 box, 1 chest fly machine, 1 high pull and low rowing trainer,
// dumbbells + 2 benches, a couple of standard bars, weight plates, 1 ez curl bar,
// 1 cable machine, 2 leg press, 1 leg extension, 1 squat rack, 1 bench press machine,
// kettlebells, resistance bands, exercise ball
export const GYM_EQUIPMENT: Equipment[] = [
  "dumbbell",
  "body only",
  "barbell", // includes weight plate exercises (plate rows, plate presses, etc.)
  "e-z curl bar",
  "cable",
  "machine",
  "kettlebells",
  "bands",
  "exercise ball",
  "other", // includes box jumps and other bodyweight exercises
];

// Muscle groups for each workout type
export const WORKOUT_MUSCLES: Record<WorkoutType, Muscle[]> = {
  upper: ["chest", "lats", "middle back", "biceps", "triceps", "shoulders"],
  lower: ["quadriceps", "hamstrings", "glutes", "calves"],
  full: [
    "chest",
    "lats",
    "biceps",
    "triceps",
    "shoulders",
    "quadriceps",
    "hamstrings",
    "glutes",
    "calves",
    "abdominals",
  ],
};

// Balanced muscle group targets for each workout type
// Each workout should include exercises targeting these muscle groups
export const BALANCED_WORKOUT_MUSCLES: Record<WorkoutType, { primary: Muscle[]; secondary: Muscle[] }> = {
  upper: {
    // Push/pull balanced: chest, shoulders, triceps (push) vs lats, middle back, biceps (pull)
    primary: ["chest", "lats", "shoulders", "biceps", "triceps"],
    secondary: ["middle back", "forearms"],
  },
  lower: {
    // Balanced leg workout: quads, hamstrings, glutes, calves
    primary: ["quadriceps", "hamstrings", "glutes"],
    secondary: ["calves", "abdominals"],
  },
  full: {
    // Full body: include all major muscle groups
    primary: ["chest", "lats", "biceps", "triceps", "shoulders", "quadriceps", "hamstrings", "glutes"],
    secondary: ["calves", "abdominals", "middle back"],
  },
};

// Minimum exercises per primary muscle group for balanced workouts
export const MIN_EXERCISES_PER_MUSCLE: Record<WorkoutType, number> = {
  upper: 1,   // At least 1 exercise targeting chest, lats, shoulders, biceps, or triceps
  lower: 1,   // At least 1 exercise targeting quads, hamstrings, or glutes
  full: 1,    // At least 1 exercise per major muscle group
};

// Targeted stretches for each workout type
export const WORKOUT_STRETCHES: Record<WorkoutType, Array<{ name: string; targetMuscle: Muscle; duration: number }>> = {
  upper: [
    { name: "Chest Doorway Stretch", targetMuscle: "chest", duration: 30 },
    { name: "Cross-Body Shoulder Stretch", targetMuscle: "shoulders", duration: 30 },
    { name: "Tricep Overhead Stretch", targetMuscle: "triceps", duration: 30 },
  ],
  lower: [
    { name: "Standing Quad Stretch", targetMuscle: "quadriceps", duration: 30 },
    { name: "Standing Hamstring Stretch", targetMuscle: "hamstrings", duration: 30 },
    { name: "Hip Flexor Stretch", targetMuscle: "glutes", duration: 30 },
  ],
  full: [
    { name: "Chest Doorway Stretch", targetMuscle: "chest", duration: 30 },
    { name: "Standing Quad Stretch", targetMuscle: "quadriceps", duration: 30 },
    { name: "Hip Flexor Stretch", targetMuscle: "glutes", duration: 30 },
  ],
};

// Image base URL for free-exercise-db
export const EXERCISE_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
