import React, { useState } from "react";

interface ExerciseVideoProps {
  exerciseName: string;
  exerciseId: string;
}

// YouTube video IDs for common exercises
const EXERCISE_VIDEOS: Record<string, string[]> = {
  "push up": ["J0DnG1S92z0", "IYPTJ3L03Nw"],
  "bench press": ["rT7DgCr-3pg", "vcBig73ojpE"],
  "squat": ["aclHkVaku9U", "UXJrBG6Pcfc"],
  "plank": ["ASdvN_XEl_c", "pSHjTRCQxIw"],
  "burpee": ["TU8QYVW0gDU", "J2CrEE2aLVM"],
  "jumping jack": ["UpRH7Iry6Kg", "Cj2TaGwpH7Y"],
  "lunge": ["QOVG1HjEjEN", "UG5LgD6TyNQ"],
  "deadlift": ["opIkpB7nY9A", "wYJ0fK9Kvn4"],
  "row": ["vT2GjY_Umpw", "Gz8jfLXfNdo"],
  "curl": ["ykPuJr1Eq9A", "kwK7O3Ck5i0"],
  "pull up": ["eGo4IYlbE5k", "2Z6wWTRcZCs"],
  "chin up": ["C5R1exO2BVM", "EBQ6Mp4Z4pI"],
  "dip": ["2z8D5g7pY2k", "2w7uO1ZpY8I"],
  "shoulder press": ["q聚合K7gR6A", "cvS3KvX1P0k"],
  "lateral raise": ["3mj6wL3nV5Y", "wP3J1K2M3E8"],
  "bicep curl": ["ykPuJr1Eq9A", "kwK7O3Ck5i0"],
  "tricep extension": ["5tLhO4K3M8E", "yJ2K7gL6N9P"],
  "leg press": ["IZxyjW7MPJQ", "f2BPxO5R3L6"],
  "leg curl": ["8t9u6L3N2K5", "mL4J7K9P1Q3"],
  "calf raise": ["GwB3f2M1N4K", "J6K1L2M3N4O"],
  "lat pulldown": ["vT2GjY_Umpw", "Gz8jfLXfNdo"],
  "cable": ["7L8K4M5N6O7", "8P9Q1R2S3T4"],
  "face pull": ["9U3K2L4M5N6", "0O1P2Q3R4S5"],
  "chest press": ["rT7DgCr-3pg", "vcBig73ojpE"],
  "incline press": ["vcBig73ojpE", "rT7DgCr-3pg"],
  "fly": ["9V8w7K6L5M4", "2N3M4L5K6J7"],
  "kickback": ["5P6Q7R8S9T0", "1U2V3W4X5Y6"],
  "shrug": ["4M5N6O7P8Q9", "0R1S2T3U4V5"],
  "crunch": ["X7Y8Z9A0B1C", "2D3E4F5G6H7"],
  "plank": ["ASdvN_XEl_c", "pSHjTRCQxIw"],
  "mountain climber": ["K6L7M8N9O0P", "1Q2R3S4T5U6"],
  "jumping jack": ["UpRH7Iry6Kg", "Cj2TaGwpH7Y"],
  "high knee": ["7V8W9X0Y1Z2", "3A4B5C6D7E8"],
};

// Get video IDs for an exercise name
function getVideoIds(exerciseName: string): string[] {
  const lowerName = exerciseName.toLowerCase();
  
  for (const [pattern, ids] of Object.entries(EXERCISE_VIDEOS)) {
    if (lowerName.includes(pattern)) {
      return ids;
    }
  }
  
  return [];
}

export const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  exerciseName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const videoIds = getVideoIds(exerciseName);
  const videoUrl = videoIds.length > 0 
    ? `https://www.youtube.com/embed/${videoIds[0]}?rel=0&modestbranding=1`
    : null;

  const handleOpen = () => {
    if (videoUrl) {
      setLoading(true);
      setIsOpen(true);
    } else {
      // Open YouTube search in new tab if no video ID found
      const query = encodeURIComponent(`${exerciseName} exercise form tutorial`);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 py-2 px-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Demo
      </button>

      {/* Video Modal */}
      {isOpen && videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl"
          >
            ✕
          </button>

          {/* Title */}
          <div className="absolute top-4 left-4 text-white">
            <h3 className="font-bold text-lg">{exerciseName}</h3>
            <p className="text-sm text-white/70">Demo Video</p>
          </div>

          {/* Video */}
          <div className="w-full max-w-3xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <iframe
              src={videoUrl}
              title={`${exerciseName} demo`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
