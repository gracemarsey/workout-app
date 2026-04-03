import React, { useEffect, useState, useRef } from "react";

interface WorkoutTimerProps {
  state: "idle" | "running" | "paused" | "completed";
  elapsedSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  state,
  elapsedSeconds,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  const [displaySeconds, setDisplaySeconds] = useState(elapsedSeconds);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  // Sync with prop when not running
  useEffect(() => {
    if (state !== "running") {
      setDisplaySeconds(elapsedSeconds);
      accumulatedRef.current = elapsedSeconds;
    }
  }, [elapsedSeconds, state]);

  // Start interval when running
  useEffect(() => {
    if (state === "running") {
      startTimeRef.current = Date.now();
      accumulatedRef.current = elapsedSeconds;
      
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = startTimeRef.current ? Math.floor((now - startTimeRef.current) / 1000) : 0;
        setDisplaySeconds(accumulatedRef.current + elapsed);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [state]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="bg-gray-900 text-green-400 font-mono text-2xl px-4 py-2 rounded-lg">
        {formatTime(displaySeconds)}
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
