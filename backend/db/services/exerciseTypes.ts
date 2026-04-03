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

// Gym equipment (all available)
export const GYM_EQUIPMENT: Equipment[] = [
  "dumbbell",
  "bands",
  "body only",
  "barbell",
  "cable",
  "machine",
  "e-z curl bar",
  "kettlebells",
  "exercise ball",
  "medicine ball",
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

// Image base URL for free-exercise-db
export const EXERCISE_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
