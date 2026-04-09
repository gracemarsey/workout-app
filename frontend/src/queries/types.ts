export interface Exercise {
  id: string;
  name: string;
  force: string | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  imageUrls: string[];
}

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
  targetMuscle?: string;
}

export interface GeneratedWorkout {
  id: string;
  type: "upper" | "lower" | "full";
  location: "home" | "gym";
  exercises: WorkoutExercise[];
  stretches: WorkoutExercise[];
  weekNumber: number;
  cycleNumber: number;
}

export interface WeeklyProgress {
  total: number;
  upper: boolean;
  lower: boolean;
  full: boolean;
}

export interface SuggestedWorkout {
  type: "upper" | "lower" | "full";
  reason: string;
}

export interface DismissResponse {
  dismissed: boolean;
  reason: string;
  replacement: WorkoutExercise | null;
}
