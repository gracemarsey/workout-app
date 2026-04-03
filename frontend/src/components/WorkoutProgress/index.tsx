import React from "react";

interface WorkoutProgressProps {
  completed: number;
  total: number;
}

export const WorkoutProgress: React.FC<WorkoutProgressProps> = ({
  completed,
  total,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Progress</span>
        <span className="font-medium text-gray-700">
          {completed} / {total} exercises
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-400">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
