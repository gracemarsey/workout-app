import React, { useEffect } from "react";

interface WorkoutTimerProps {
  state: "idle" | "running" | "paused" | "completed";
  elapsedSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onTick: () => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  state,
  elapsedSeconds,
  onStart,
  onPause,
  onResume,
  onStop,
  onTick,
}) => {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (state === "running") {
      interval = setInterval(onTick, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, onTick]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="bg-gray-900 text-green-400 font-mono text-2xl px-4 py-2 rounded-lg">
        {formatTime(elapsedSeconds)}
      </div>

      <div className="flex gap-2">
        {state === "idle" && (
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ▶ Start
          </button>
        )}

        {state === "running" && (
          <button
            onClick={onPause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ⏸ Pause
          </button>
        )}

        {state === "paused" && (
          <>
            <button
              onClick={onResume}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ▶ Resume
            </button>
            <button
              onClick={onStop}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ⏹ Stop
            </button>
          </>
        )}

        {state === "completed" && (
          <span className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg">
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  );
};
