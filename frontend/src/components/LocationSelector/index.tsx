import React from "react";

interface LocationSelectorProps {
  value: "home" | "gym";
  onChange: (location: "home" | "gym") => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => onChange("home")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          value === "home"
            ? "bg-white shadow text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        🏠 Home
      </button>
      <button
        onClick={() => onChange("gym")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          value === "gym"
            ? "bg-white shadow text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        🏋️ Gym
      </button>
    </div>
  );
};
