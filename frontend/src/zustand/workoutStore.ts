import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => {
      return {
        location: "gym",
        workoutType: "upper",
        
        upperHome: { workout: null, timerSeconds: 0 },
        upperGym: { workout: null, timerSeconds: 0 },
        lowerHome: { workout: null, timerSeconds: 0 },
        lowerGym: { workout: null, timerSeconds: 0 },
        fullHome: { workout: null, timerSeconds: 0 },
        fullGym: { workout: null, timerSeconds: 0 },
        
        timerState: {
          isRunning: false,
          startTime: null,
          accumulatedSeconds: 0,
          activeWorkoutKey: null,
        },
        
        setLocation: (loc) => set({ location: loc }),
        setWorkoutType: (type) => set({ workoutType: type }),
        
        setWorkout: (workout) => {
          if (!workout) return;
          const state = get();
          const key = `${workout.type}${state.location}`;
          
          const existingData = state[key as keyof WorkoutStore] as WorkoutData | undefined;
          const isTimerActive = state.timerState.activeWorkoutKey === key && 
                                (state.timerState.isRunning || state.timerState.accumulatedSeconds > 0);
          
          if (isTimerActive && existingData?.workout) {
            set({ [key]: { 
              workout: { ...existingData.workout, stretches: workout.stretches }, 
              timerSeconds: existingData.timerSeconds 
            } } as any);
          } else {
            set({ [key]: { workout, timerSeconds: existingData?.timerSeconds ?? 0 } } as any);
          }
        },
        
        updateExercise: (exerciseId, completed) => {
          const state = get();
          const key = `${state.workoutType}${state.location}`;
          const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
          if (!data?.workout) return;
          
          const exercises = data.workout.exercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, completed } : ex
          );
          
          const stretches = data.workout.stretches?.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, completed } : ex
          );
          
          set({ [key]: { ...data, workout: { ...data.workout, exercises, stretches } } } as any);
        },
        
        startTimer: () => {
          const state = get();
          const key = `${state.workoutType}${state.location}`;
          const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
          if (!data?.workout) return;
          
          set({
            timerState: {
              isRunning: true,
              startTime: Date.now(),
              accumulatedSeconds: 0,
              activeWorkoutKey: key,
            },
            [key]: { ...data, timerSeconds: 0 }
          } as any);
        },
        
        pauseTimer: () => {
          const state = get();
          const { timerState } = state;
          
          if (!timerState.isRunning || !timerState.startTime || !timerState.activeWorkoutKey) return;
          
          const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
          const newAccumulated = timerState.accumulatedSeconds + elapsed;
          
          const key = timerState.activeWorkoutKey;
          const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
          
          set({
            timerState: {
              ...timerState,
              isRunning: false,
              startTime: null,
              accumulatedSeconds: newAccumulated,
            },
            ...(data ? { [key]: { ...data, timerSeconds: newAccumulated } } : {})
          } as any);
        },
        
        resumeTimer: () => {
          const state = get();
          const { timerState } = state;
          
          if (timerState.isRunning) return;
          
          const key = `${state.workoutType}${state.location}`;
          
          set({
            timerState: {
              ...timerState,
              isRunning: true,
              startTime: Date.now(),
              activeWorkoutKey: key,
            }
          });
        },
        
        stopTimer: () => {
          const state = get();
          const { timerState } = state;
          
          if (timerState.activeWorkoutKey) {
            const key = timerState.activeWorkoutKey;
            const data = state[key as keyof WorkoutStore] as WorkoutData | undefined;
            
            set({
              timerState: {
                isRunning: false,
                startTime: null,
                accumulatedSeconds: 0,
                activeWorkoutKey: null,
              },
              ...(data ? { [key]: { ...data, timerSeconds: 0 } } : {})
            } as any);
            return;
          }
          
          set({
            timerState: {
              isRunning: false,
              startTime: null,
              accumulatedSeconds: 0,
              activeWorkoutKey: null,
            }
          });
        },
      };
    },
    {
      name: "workout-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        location: state.location,
        workoutType: state.workoutType,
        upperHome: state.upperHome,
        upperGym: state.upperGym,
        lowerHome: state.lowerHome,
        lowerGym: state.lowerGym,
        fullHome: state.fullHome,
        fullGym: state.fullGym,
        timerState: state.timerState,
      }),
    }
  )
);

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

export type { WorkoutData };
