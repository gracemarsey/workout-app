import React, { useState } from "react";

interface DismissModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (reason: "not_available" | "dont_feel_like_it") => void;
  exerciseName: string;
}

export const DismissModal: React.FC<DismissModalProps> = ({
  isOpen,
  onClose,
  onDismiss,
  exerciseName,
}) => {
  const [reason, setReason] = useState<"not_available" | "dont_feel_like_it" | null>(null);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (reason) {
      onDismiss(reason);
      setReason(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Skip this exercise?
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Why are you skipping "{exerciseName}"?
        </p>

        <div className="space-y-3 mb-6">
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              reason === "not_available"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="reason"
              checked={reason === "not_available"}
              onChange={() => setReason("not_available")}
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-800">Equipment not available</div>
              <div className="text-xs text-gray-500">
                We'll suggest a similar exercise with different equipment
              </div>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              reason === "dont_feel_like_it"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="reason"
              checked={reason === "dont_feel_like_it"}
              onChange={() => setReason("dont_feel_like_it")}
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-800">Don't feel like it</div>
              <div className="text-xs text-gray-500">
                We'll suggest a different exercise with the same equipment
              </div>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDismiss}
            disabled={!reason}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              reason
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Skip Exercise
          </button>
        </div>
      </div>
    </div>
  );
};
