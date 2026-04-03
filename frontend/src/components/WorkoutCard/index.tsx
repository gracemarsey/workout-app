import React from "react";
import { useNavigate } from "react-router-dom";

interface WorkoutCardProps {
  type: "upper" | "lower" | "full";
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  type,
  title,
  description,
  icon,
  color,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/workouts/${type}`)}
      className="w-full p-6 rounded-xl shadow-md transition-all duration-200 text-left bg-white hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};
