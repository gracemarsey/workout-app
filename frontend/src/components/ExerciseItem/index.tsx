import React, { useState } from "react";
import { WorkoutExercise } from "../../queries/types";
import { DismissModal } from "../DismissModal";
import { ExerciseVideo } from "../ExerciseVideo";

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
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                exercise.completed ? "bg-green-500 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              {exercise.completed ? "✓" : index + 1}
            </div>

            {!exercise.isWarmup && !exercise.isCooldown && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {!imageError && exercise.imageUrls[0] ? (
                  <img
                    src={exercise.imageUrls[0]}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {getEquipmentIcon(exercise.equipment)}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {getEquipmentIcon(exercise.equipment)} {exercise.equipment}
              </p>

              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => handleRepsChange(e.target.value)}
                    disabled={exercise.completed}
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-md text-center disabled:bg-gray-100 disabled:text-gray-500"
                    min="1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Weight</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    disabled={exercise.completed}
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-md text-center disabled:bg-gray-100 disabled:text-gray-500"
                    min="0"
                  />
                  <span className="text-xs text-gray-400">kg</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                exercise.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400 text-transparent hover:text-green-400"
              }`}
            >
              ✓
            </button>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {!exercise.isWarmup && !exercise.isCooldown && (
              <>
                <ExerciseVideo exerciseName={exercise.name} exerciseId={exercise.exerciseId} />
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex-1 py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {showInstructions ? "Hide" : "Show"} Instructions
                </button>
              </>
            )}
            <button
              onClick={() => setShowDismissModal(true)}
              className="py-2 px-3 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              ✕ Skip
            </button>
          </div>

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
