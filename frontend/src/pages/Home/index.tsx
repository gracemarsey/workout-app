import React from "react";
import { useNavigate } from "react-router-dom";
import { ProgressTracker } from "../../components/ProgressTracker";
import { useWeeklyProgress } from "../../queries/useWeeklyProgress";
import { useSuggestedWorkout } from "../../queries/useSuggestedWorkout";
import { useUserStore } from "../../zustand/user";
import { WeeklyProgress, SuggestedWorkout } from "../../queries/types";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useUserStore();
  
  // For demo purposes, use a hardcoded user or get from token
  const userId = "demo_user";

  const { data: progress, isLoading: progressLoading } = useWeeklyProgress(userId);
  const { data: suggestion, isLoading: suggestionLoading } = useSuggestedWorkout(userId);

  const isLoading = progressLoading || suggestionLoading;

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case "upper":
        return "💪";
      case "lower":
        return "🦵";
      case "full":
        return "🔥";
      default:
        return "🏋️";
    }
  };

  const getWorkoutColor = (type: string) => {
    switch (type) {
      case "upper":
        return "bg-blue-500";
      case "lower":
        return "bg-green-500";
      case "full":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          {/* Week indicator */}
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <span>Week 1</span>
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            <span>Cycle 1</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Loading state */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-2 bg-gray-200 rounded-full mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Weekly Progress */
          <ProgressTracker
            total={(progress as WeeklyProgress)?.total ?? 0}
            upper={(progress as WeeklyProgress)?.upper ?? false}
            lower={(progress as WeeklyProgress)?.lower ?? false}
            full={(progress as WeeklyProgress)?.full ?? false}
          />
        )}

        {/* Suggested Workout */}
        {!isLoading && suggestion && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-800">Today's Suggestion</h2>
            <button
              onClick={() => navigate(`/workouts/${(suggestion as SuggestedWorkout).type}`)}
              className="w-full p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl ${getWorkoutColor(
                    suggestion.type
                  )} flex items-center justify-center text-2xl text-white`}
                >
                  {getWorkoutIcon(suggestion.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 capitalize">
                    {suggestion.type} Body Workout
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {suggestion.reason}
                  </p>
                </div>
                <div className="text-blue-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Quick Start */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800">Quick Start</h2>
          <div className="grid grid-cols-3 gap-3">
            {["upper", "lower", "full"].map((type) => (
              <button
                key={type}
                onClick={() => navigate(`/workouts/${type}`)}
                className={`p-4 rounded-xl ${getWorkoutColor(
                  type
                )} text-white text-center transition-all hover:scale-105`}
              >
                <div className="text-2xl mb-1">{getWorkoutIcon(type)}</div>
                <div className="text-xs font-medium capitalize">{type}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
