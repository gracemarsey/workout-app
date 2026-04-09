import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WorkoutTimer } from "../../components/WorkoutTimer";
import { WorkoutProgress } from "../../components/WorkoutProgress";
import { ExerciseItem } from "../../components/ExerciseItem";
import { LocationSelector } from "../../components/LocationSelector";
import { useWorkoutStore, useCurrentWorkout } from "../../zustand/workoutStore";
import { useGenerateWorkout } from "../../queries/useGenerateWorkout";
import { useCompleteWorkout } from "../../queries/useCompleteWorkout";
import { useDismissExercise } from "../../queries/useDismissExercise";
import { useToast } from "../../components/Toast";
import { WorkoutExercise } from "../../queries/types";

export const WorkoutDetail: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const workoutType = type as "upper" | "lower" | "full";
  
  const store = useWorkoutStore();
  const { workout: currentWorkout, timerSeconds } = useCurrentWorkout(workoutType);
  
  const generateWorkout = useGenerateWorkout();
  const completeWorkout = useCompleteWorkout();
  const dismissExercise = useDismissExercise();
  const { showToast } = useToast();

  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generate workout only once when page loads
  useEffect(() => {
    if (hasGenerated) return;
    if (generateWorkout.isLoading) return;
    
    setHasGenerated(true);
    setWorkoutCompleted(false);
    
    generateWorkout.mutate(
      { userId: "demo_user", type: workoutType, location: store.location },
      { 
        onSuccess: (data) => {
          console.log("Workout generated:", data);
          store.setWorkout(data);
        }, 
        onError: (error: unknown) => {
          console.error("Failed to generate workout:", error);
          let errorMessage = "Failed to generate workout";
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: string } } };
            errorMessage = axiosError.response?.data?.error || errorMessage;
          }
          showToast(errorMessage, "error");
          setHasGenerated(false);
        } 
      }
    );
  }, [workoutType]);

  // Update workout type in store
  useEffect(() => {
    store.setWorkoutType(workoutType);
  }, [workoutType]);

  // Handle workout completion
  useEffect(() => {
    if (currentWorkout && !workoutCompleted && !generateWorkout.isLoading) {
      const allComplete = currentWorkout.exercises.every((e) => e.completed);
      if (allComplete) {
        handleWorkoutComplete();
      }
    }
  }, [currentWorkout?.exercises]);

  const handleWorkoutComplete = () => {
    if (!currentWorkout) return;

    if (store.timerState.isRunning) {
      store.pauseTimer();
    }

    const duration = Math.ceil(timerSeconds / 60);
    setCompletedDuration(duration);

    completeWorkout.mutate(
      {
        userId: "demo_user",
        workoutId: currentWorkout.id,
        type: workoutType,
        location: store.location,
        durationMinutes: duration || 1,
        exercises: currentWorkout.exercises,
      },
      {
        onSuccess: () => {
          setWorkoutCompleted(true);
          store.setWorkout(null);
        },
        onError: () => {
          showToast("Failed to save workout", "error");
        },
      }
    );
  };

  const handleLocationChange = (newLocation: "home" | "gym") => {
    if (store.timerState.isRunning && store.timerState.activeWorkoutKey === `${workoutType}${store.location}`) {
      store.pauseTimer();
    }
    store.setLocation(newLocation);
    setHasGenerated(false);
  };

  const handleExerciseUpdate = (exerciseId: string, completed: boolean) => {
    store.updateExercise(exerciseId, completed);
  };

  const handleDismissExercise = (exercise: WorkoutExercise, reason: "not_available" | "dont_feel_like_it") => {
    dismissExercise.mutate(
      { 
        userId: "demo_user", 
        exercise, 
        reason, 
        location: store.location,
        currentWorkoutExercises: currentWorkout?.exercises.filter(e => !e.isStretch) || []
      },
      {
        onSuccess: (data) => {
          if (data?.replacement) {
            const updatedExercises: WorkoutExercise[] = currentWorkout?.exercises.map((ex: WorkoutExercise) => {
              if (ex.exerciseId === exercise.exerciseId && data.replacement) {
                return data.replacement;
              }
              return ex;
            }) || [];
            
            store.setWorkout({ ...currentWorkout!, exercises: updatedExercises });
            showToast(`Swapped to ${data.replacement.name}`, "success");
          } else {
            showToast("No replacement found for this exercise", "info");
          }
        },
        onError: () => showToast("Failed to skip exercise", "error"),
      }
    );
  };

  const handleNewWorkout = () => {
    setHasGenerated(false);
    setWorkoutCompleted(false);
    setTimeout(() => {
      generateWorkout.mutate(
        { userId: "demo_user", type: workoutType, location: store.location },
        { onSuccess: (data) => store.setWorkout(data), onError: () => showToast("Failed to generate workout", "error") }
      );
    }, 0);
  };

  const mainExercises = currentWorkout?.exercises.filter(e => !e.isStretch) ?? [];
  const completedCount = mainExercises.filter(e => e.completed).length ?? 0;
  const totalCount = mainExercises.length ?? 0;
  const allComplete = mainExercises.every(e => e.completed) ?? false;

  const getTitle = () => workoutType === "upper" ? "Upper Body" : workoutType === "lower" ? "Lower Body" : "Full Body";
  const getIcon = () => workoutType === "upper" ? "💪" : workoutType === "lower" ? "🦵" : "🔥";

  const getTimerState = () => {
    const { timerState } = store;
    const currentKey = `${workoutType}${store.location}`;
    
    if (timerState.isRunning && timerState.activeWorkoutKey === currentKey) return "running";
    if (timerState.accumulatedSeconds > 0 && timerState.activeWorkoutKey === currentKey) return "paused";
    return "idle";
  };

  if (workoutCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Great Job!</h1>
          <p className="text-gray-600 mb-6">You crushed the {getTitle()} workout!</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{getIcon()}</div>
                <div className="text-sm text-gray-500">{getTitle()}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedDuration} min</div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/progress")}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              View My Progress 📊
            </button>
            <button
              onClick={() => navigate("/workouts")}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Back to Workouts
            </button>
            <button
              onClick={handleNewWorkout}
              className="w-full py-3 px-4 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-colors"
            >
              Do Another {getTitle()} Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate("/workouts")} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">←</button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getIcon()}</span>
              <h1 className="text-xl font-bold text-gray-800">{getTitle()} Workout</h1>
            </div>
          </div>

          <WorkoutTimer
            state={getTimerState()}
            elapsedSeconds={timerSeconds}
            onStart={store.startTimer}
            onPause={store.pauseTimer}
            onResume={store.resumeTimer}
            onStop={store.stopTimer}
          />

          <div className="mt-4">
            <WorkoutProgress completed={completedCount} total={totalCount} />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-2 block">Workout Location</label>
          <LocationSelector value={store.location} onChange={handleLocationChange} />
        </div>

        {generateWorkout.isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="flex gap-4">
                  <div className="h-8 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {currentWorkout && (
          <div className="space-y-4">
            {mainExercises.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">💪 Main Workout</h3>
                {mainExercises.map((ex, i) => (
                  <ExerciseItem
                    key={ex.exerciseId}
                    exercise={ex}
                    index={i}
                    onUpdate={(updates) => handleExerciseUpdate(ex.exerciseId, updates.completed ?? false)}
                    onDismiss={handleDismissExercise}
                  />
                ))}
              </div>
            )}

            {currentWorkout.stretches && currentWorkout.stretches.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">🧘 Stretches</h3>
                {currentWorkout.stretches.map((ex, i) => (
                  <ExerciseItem
                    key={ex.exerciseId}
                    exercise={ex}
                    index={i}
                    onUpdate={(updates) => handleExerciseUpdate(ex.exerciseId, updates.completed ?? false)}
                    onDismiss={handleDismissExercise}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {allComplete && !workoutCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleWorkoutComplete}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all"
            >
              🎉 Complete Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
