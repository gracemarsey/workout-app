import React from "react";

interface ProgressTrackerProps {
  total: number; // 0-3
  upper: boolean;
  lower: boolean;
  full: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  total,
  upper,
  lower,
  full,
}) => {
  const workouts = [
    { type: "Upper", completed: upper, color: "bg-blue-500" },
    { type: "Lower", completed: lower, color: "bg-green-500" },
    { type: "Full", completed: full, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Weekly Progress</h3>
        <span className="text-sm text-gray-500">
          {total} / 3 workouts
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(total / 3) * 100}%` }}
        />
      </div>

      {/* Workout list */}
      <div className="space-y-2">
        {workouts.map(({ type, completed, color }) => (
          <div key={type} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-medium transition-all duration-300 ${
                completed ? "scale-100 opacity-100" : "scale-90 opacity-50"
              }`}
            >
              {completed ? "✓" : type[0]}
            </div>
            <span
              className={`text-sm ${
                completed ? "text-gray-800 font-medium" : "text-gray-400"
              }`}
            >
              {type} Body
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
