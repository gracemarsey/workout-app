import axios, { AxiosRequestConfig } from "axios";

// Get API base URL - uses environment variable or localhost for dev
const getApiBaseUrl = () => {
  // If VITE_API_URL is set (for mobile/remote access), use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're accessing via network IP (not localhost)
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:7231`;
  }
  
  // Default to localhost for local development
  return "http://localhost:7231";
};

export const apiRequest = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
) => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await axios<T>(`${baseUrl}/api${url}`, options);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
