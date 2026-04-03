import React, { useState } from "react";

interface ExerciseVideoProps {
  exerciseName: string;
  exerciseId: string;
}

export const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  exerciseName,
  exerciseId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate a YouTube search URL for the exercise
  const getYouTubeSearchUrl = (name: string) => {
    const searchQuery = encodeURIComponent(`${name} exercise form tutorial`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  // Popular exercise video IDs for common exercises (fallback)
  const getVideoId = (name: string): string | null => {
    const videos: Record<string, string> = {
      "push up": "J0DnG1S92z0",
      "push-up": "J0DnG1S92z0",
      "bench press": "rT7DgCr-3pg",
      "squat": "aclHkVaku9U",
      "plank": "ASdvN_XEl_c",
      "burpee": "TU8QYVW0gDU",
      "jumping jack": "UpRH7Iry6Kg",
      "arm circle": "GJqM9JmVQjM",
      "leg swing": "8iPEnn-lsC4",
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, videoId] of Object.entries(videos)) {
      if (lowerName.includes(key)) {
        return videoId;
      }
    }
    return null;
  };

  const videoId = getVideoId(exerciseName);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?rel=0`
    : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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
        Watch Demo
      </button>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800">Demo Video</h3>
                <p className="text-sm text-gray-500">{exerciseName}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Video Container */}
            <div className="aspect-video bg-gray-900">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${exerciseName} demo`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                  <p className="text-lg mb-4">Video not available for this exercise</p>
                  <a
                    href={getYouTubeSearchUrl(exerciseName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Search on YouTube →
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50">
              <a
                href={getYouTubeSearchUrl(exerciseName)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Search for more videos on YouTube →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
