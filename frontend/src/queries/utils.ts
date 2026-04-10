import axios, { AxiosRequestConfig } from "axios";

// Get API base URL - uses environment variable or localhost for dev
const getApiBaseUrl = () => {
  // Use VITE_API_URL if set (for mobile/tablet on local network)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Default to localhost for local development
  return "http://localhost:9205";
};

export const apiRequest = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const baseUrl = getApiBaseUrl();
  const fullUrl = `${baseUrl}/api${url}`;

  // Log the request for debugging
  console.log(`API Request: ${options.method || "GET"} ${fullUrl}`);

  try {
    const response = await axios<T>(fullUrl, options);
    return response.data;
  } catch (error: unknown) {
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      console.error(`API Error [${error.response?.status || "Network"}]:`, {
        url: fullUrl,
        method: options.method || "GET",
        status: error.response?.status,
        message: error.message,
        code: error.code,
      });
    } else {
      console.error("API Error:", error);
    }
    throw error;
  }
};
