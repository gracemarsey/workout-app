import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeeklyProgress } from "../../queries/useWeeklyProgress";
import { useWorkoutHistory, WorkoutHistoryItem } from "../../queries/useWorkoutHistory";
import { useCompletedWorkout } from "../../queries/useCompletedWorkout";
import { WeeklyProgress } from "../../queries/types";

const USER_ID = "demo_user";

export const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { data: weeklyProgress, isLoading: loadingWeekly } = useWeeklyProgress(USER_ID);
  const { data: history, isLoading: loadingHistory } = useWorkoutHistory(USER_ID, 20);
  
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const { data: selectedWorkout, isLoading: loadingWorkout } = useCompletedWorkout(selectedWorkoutId);
  
  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };
  
  const handleBack = () => {
    setSelectedWorkoutId(null);
  };

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case "upper": return "💪";
      case "lower": return "🦵";
      case "full": return "🔥";
      default: return "🏋️";
    }
  };

  const getWorkoutName = (type: string) => {
    switch (type) {
      case "upper": return "Upper Body";
      case "lower": return "Lower Body";
      case "full": return "Full Body";
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = dateStr.split("T")[0];
    const todayOnly = today.toISOString().split("T")[0];
    const yesterdayOnly = yesterday.toISOString().split("T")[0];

    if (dateOnly === todayOnly) {
      return "Today";
    }
    if (dateOnly === yesterdayOnly) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const weekly = weeklyProgress as WeeklyProgress | undefined;

  // Show workout detail view
  if (selectedWorkoutId && (selectedWorkout || loadingWorkout)) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {selectedWorkout ? getWorkoutName(selectedWorkout.type) : "Loading..."} Workout
                </h1>
                <p className="text-sm text-gray-500">
                  {selectedWorkout ? `${formatDate(selectedWorkout.date)} • ${selectedWorkout.duration} min` : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {loadingWorkout ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {selectedWorkout && selectedWorkout.exercises && selectedWorkout.exercises.length > 0 ? (
                  selectedWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                          <p className="text-sm text-gray-500">
                            {exercise.reps} reps • {exercise.weight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No exercise data available
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedWorkout?.exercises?.length || 0}</div>
                    <div className="text-xs text-gray-500">Exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedWorkout?.duration}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Progress</h1>
          <p className="text-gray-500 mt-1">Track your workout history</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Weekly Overview */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">This Week</h3>
          {loadingWeekly ? (
            <div className="grid grid-cols-3 gap-4 text-center animate-pulse">
              <div><div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-1" /><div className="h-3 bg-gray-200 rounded w-8 mx-auto" /></div>
              <div><div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-1" /><div className="h-3 bg-gray-200 rounded w-8 mx-auto" /></div>
              <div><div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-1" /><div className="h-3 bg-gray-200 rounded w-8 mx-auto" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl ${weekly?.upper ? "bg-green-100" : "bg-gray-100"}`}>
                  {weekly?.upper ? "✅" : "💪"}
                </div>
                <div className="text-sm text-gray-500 mt-1">Upper</div>
              </div>
              <div>
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl ${weekly?.lower ? "bg-green-100" : "bg-gray-100"}`}>
                  {weekly?.lower ? "✅" : "🦵"}
                </div>
                <div className="text-sm text-gray-500 mt-1">Lower</div>
              </div>
              <div>
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl ${weekly?.full ? "bg-green-100" : "bg-gray-100"}`}>
                  {weekly?.full ? "✅" : "🔥"}
                </div>
                <div className="text-sm text-gray-500 mt-1">Full</div>
              </div>
            </div>
          )}
        </div>

        {/* Workout History */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Workout History</h3>
          
          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-1">
              {history.map((workout: WorkoutHistoryItem, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className="w-full flex items-center gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    {getWorkoutIcon(workout.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800">{getWorkoutName(workout.type)}</div>
                    <div className="text-xs text-gray-500">
                      {workout.duration ? `${workout.duration} min` : ""} {workout.location === "home" ? "🏠" : "🏋️"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(workout.date)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 text-sm">No workout history yet</p>
              <button
                onClick={() => navigate("/workouts")}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Start a Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
