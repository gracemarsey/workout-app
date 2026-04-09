import React, { useState } from "react";
import { WorkoutExercise } from "../../queries/types";
import { DismissModal } from "../DismissModal";

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  onUpdate: (updates: Partial<WorkoutExercise>) => void;
  onDismiss: (exercise: WorkoutExercise, reason: "not_available" | "dont_feel_like_it") => void;
  index: number;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onUpdate,
  onDismiss,
  index,
}) => {
  const [reps, setReps] = useState(exercise.reps.toString());
  const [weight, setWeight] = useState(exercise.weight.toString());
  const [sets, setSets] = useState("3"); // Default sets value
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRepsChange = (value: string) => {
    setReps(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onUpdate({ reps: numValue });
    }
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate({ weight: numValue });
    }
  };

  const handleSetsChange = (value: string) => {
    setSets(value);
    // Sets tracking is visual only for now
  };

  const handleComplete = () => {
    onUpdate({ completed: !exercise.completed });
  };

  const handleDismiss = (reason: "not_available" | "dont_feel_like_it") => {
    onDismiss(exercise, reason);
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case "dumbbell":
        return "🏋️";
      case "bands":
        return "➰";
      case "body only":
        return "🧍";
      case "barbell":
        return "🏋️‍♂️";
      case "cable":
        return "🔗";
      case "machine":
        return "⚙️";
      default:
        return "💪";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden">
        <div className="p-3 sm:p-4">
          {/* Header Row */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            {/* Exercise Number */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                exercise.completed ? "bg-green-500 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              {exercise.completed ? "✓" : index + 1}
            </div>

            {/* Exercise Image or Icon */}
            {!exercise.isStretch && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {!imageError && exercise.imageUrls[0] ? (
                  <img
                    src={exercise.imageUrls[0]}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">
                    {getEquipmentIcon(exercise.equipment)}
                  </div>
                )}
              </div>
            )}

            {/* Exercise Name & Equipment */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{exercise.name}</h4>
              <p className="text-xs text-gray-400 truncate">
                {getEquipmentIcon(exercise.equipment)} {exercise.equipment}
              </p>
            </div>

            {/* Complete Button */}
            <button
              onClick={handleComplete}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                exercise.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400 text-transparent hover:text-green-400"
              }`}
            >
              ✓
            </button>
          </div>

          {/* Input Fields - Responsive Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            {/* Sets */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1 font-medium">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => handleSetsChange(e.target.value)}
                disabled={exercise.completed}
                className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-base border border-gray-200 rounded-lg text-center disabled:bg-gray-100 disabled:text-gray-500 touch-manipulation"
                min="1"
              />
            </div>

            {/* Reps */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1 font-medium">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => handleRepsChange(e.target.value)}
                disabled={exercise.completed}
                className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-base border border-gray-200 rounded-lg text-center disabled:bg-gray-100 disabled:text-gray-500 touch-manipulation"
                min="1"
              />
            </div>

            {/* Weight */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1 font-medium">kg</label>
              <div className="relative w-full">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  disabled={exercise.completed}
                  className="w-full px-2 py-2 sm:py-1.5 pr-6 text-sm sm:text-base border border-gray-200 rounded-lg text-center disabled:bg-gray-100 disabled:text-gray-500 touch-manipulation"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!exercise.isStretch && (
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex-1 py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {showInstructions ? "Hide" : "Instructions"}
              </button>
            )}
            {!exercise.isStretch && (
              <button
                onClick={() => setShowDismissModal(true)}
                className="py-2 px-3 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                ✕ Skip
              </button>
            )}
          </div>

          {/* Instructions */}
          {showInstructions && exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Instructions</h5>
              <ol className="space-y-1">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-400 font-medium">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <DismissModal
        isOpen={showDismissModal}
        onClose={() => setShowDismissModal(false)}
        onDismiss={handleDismiss}
        exerciseName={exercise.name}
      />
    </>
  );
};
