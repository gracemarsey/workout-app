import React from "react";
import { WorkoutCard } from "../../components/WorkoutCard";
import { useWorkoutStore } from "../../zustand/workoutStore";

export const Workouts: React.FC = () => {
  const { location, setLocation } = useWorkoutStore();

  const workoutTypes = [
    {
      type: "upper" as const,
      title: "Upper Body",
      description: "Chest, back, shoulders & arms",
      icon: "💪",
      color: "bg-blue-500",
    },
    {
      type: "lower" as const,
      title: "Lower Body",
      description: "Quads, hamstrings, glutes & calves",
      icon: "🦵",
      color: "bg-green-500",
    },
    {
      type: "full" as const,
      title: "Full Body",
      description: "Complete body workout with cardio",
      icon: "🔥",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Workouts</h1>
          <p className="text-gray-500 mt-1">
            Choose your workout type below
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Location Selector */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Workout Location</h3>
          <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setLocation("home")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                location === "home"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setLocation("gym")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                location === "gym"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🏋️ Gym
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {location === "home"
              ? "Equipment: Dumbbells & bands"
              : "Equipment: Full gym access"}
          </p>
        </div>

        {/* Workout Cards */}
        <div className="space-y-4">
          {workoutTypes.map((workout) => (
            <WorkoutCard
              key={workout.type}
              type={workout.type}
              title={workout.title}
              description={workout.description}
              icon={workout.icon}
              color={workout.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
