import { create } from "zustand";
import { GeneratedWorkout } from "../queries/types";

interface WorkoutData {
  workout: GeneratedWorkout | null;
  timerSeconds: number;
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  accumulatedSeconds: number;
  activeWorkoutKey: string | null;
}

const STORAGE_KEY = "workout_timer_state";

function loadTimerState(): TimerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load timer state:", e);
  }
  return {
    isRunning: false,
    startTime: null,
    accumulatedSeconds: 0,
    activeWorkoutKey: null,
  };
}

function saveTimerState(state: TimerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save timer state:", e);
  }
}

interface WorkoutStore {
  location: "home" | "gym";
  workoutType: string;
  
  upperHome: WorkoutData;
  upperGym: WorkoutData;
  lowerHome: WorkoutData;
  lowerGym: WorkoutData;
  fullHome: WorkoutData;
  fullGym: WorkoutData;
  
  timerState: TimerState;
  
  setLocation: (loc: "home" | "gym") => void;
  setWorkoutType: (type: string) => void;
  setWorkout: (workout: GeneratedWorkout | null) => void;
  updateExercise: (exerciseId: string, completed: boolean) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()((set, get) => {
  const timerState = loadTimerState();
  
  return {
    location: "gym",
    workoutType: "upper",
    
    upperHome: { workout: null, timerSeconds: 0 },
    upperGym: { workout: null, timerSeconds: 0 },
    lowerHome: { workout: null, timerSeconds: 0 },
    lowerGym: { workout: null, timerSeconds: 0 },
    fullHome: { workout: null, timerSeconds: 0 },
    fullGym: { workout: null, timerSeconds: 0 },
    
    timerState,
    
    setLocation: (loc) => set({ location: loc }),
    setWorkoutType: (type) => set({ workoutType: type }),
    
    setWorkout: (workout) => {
      if (!workout) return;
      const state = get();
      const key = `${workout.type}${state.location}`;
      set({ [key]: { workout, timerSeconds: 0 } } as any);
    },
    
    updateExercise: (exerciseId, completed) => {
      const state = get();
      const key = `${state.workoutType}${state.location}`;
      const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
      if (!data?.workout) return;
      
      const exercises = data.workout.exercises.map(ex =>
        ex.exerciseId === exerciseId ? { ...ex, completed } : ex
      );
      
      set({ [key]: { ...data, workout: { ...data.workout, exercises } } } as any);
    },
    
    startTimer: () => {
      const state = get();
      const key = `${state.workoutType}${state.location}`;
      const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
      if (!data?.workout) return;
      
      const newTimerState: TimerState = {
        isRunning: true,
        startTime: Date.now(),
        accumulatedSeconds: 0,
        activeWorkoutKey: key,
      };
      
      saveTimerState(newTimerState);
      set({
        timerState: newTimerState,
        [key]: { ...data, timerSeconds: 0 }
      } as any);
    },
    
    pauseTimer: () => {
      const state = get();
      const { timerState } = state;
      
      if (!timerState.isRunning || !timerState.startTime || !timerState.activeWorkoutKey) return;
      
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      const newAccumulated = timerState.accumulatedSeconds + elapsed;
      
      const newTimerState: TimerState = {
        ...timerState,
        isRunning: false,
        startTime: null,
        accumulatedSeconds: newAccumulated,
      };
      
      saveTimerState(newTimerState);
      
      const key = timerState.activeWorkoutKey;
      const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
      if (data) {
        set({
          timerState: newTimerState,
          [key]: { ...data, timerSeconds: newAccumulated }
        } as any);
      } else {
        set({ timerState: newTimerState });
      }
    },
    
    resumeTimer: () => {
      const state = get();
      const { timerState } = state;
      
      if (timerState.isRunning) return;
      
      const key = `${state.workoutType}${state.location}`;
      
      const newTimerState: TimerState = {
        ...timerState,
        isRunning: true,
        startTime: Date.now(),
        activeWorkoutKey: key,
      };
      
      saveTimerState(newTimerState);
      set({ timerState: newTimerState });
    },
    
    stopTimer: () => {
      const state = get();
      const { timerState } = state;
      
      const newTimerState: TimerState = {
        isRunning: false,
        startTime: null,
        accumulatedSeconds: 0,
        activeWorkoutKey: null,
      };
      
      saveTimerState(newTimerState);
      
      if (timerState.activeWorkoutKey) {
        const key = timerState.activeWorkoutKey;
        const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
        if (data) {
          set({
            timerState: newTimerState,
            [key]: { ...data, timerSeconds: 0 }
          } as any);
          return;
        }
      }
      
      set({ timerState: newTimerState });
    },
  };
});

export function useCurrentWorkout(workoutType: string) {
  const store = useWorkoutStore();
  const key = `${workoutType}${store.location}`;
  const data = store[key as keyof WorkoutStore] as WorkoutData | undefined;
  
  const getElapsedSeconds = (): number => {
    const { timerState } = store;
    if (timerState.isRunning && timerState.startTime) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      return timerState.accumulatedSeconds + elapsed;
    }
    return timerState.accumulatedSeconds;
  };
  
  return {
    workout: data?.workout || null,
    timerSeconds: getElapsedSeconds(),
    timerRunning: store.timerState.isRunning && store.timerState.activeWorkoutKey === `${workoutType}${store.location}`,
    activeWorkoutKey: store.timerState.activeWorkoutKey,
  };
}
