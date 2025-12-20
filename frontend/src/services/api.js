import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://gym-management-backend.onrender.com",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error("Unauthorized access - logging out");
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden
          console.error("Access forbidden:", data.message);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", data.message);
          break;

        case 409:
          // Conflict (e.g., duplicate entry)
          console.error("Conflict:", data.message);
          break;

        case 500:
          // Server error
          console.error("Server error:", data.message);
          break;

        default:
          console.error("API error:", data.message || "Unknown error");
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response from server. Please check your connection.");
    } else {
      // Error in setting up request
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;