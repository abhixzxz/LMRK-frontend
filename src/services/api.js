import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for refresh tokens
  timeout: 10000, // 10 second timeout
});

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Helper function to remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("accessToken");
};

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            baseURL: API_URL,
          }
        );

        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, remove token and redirect to login
        removeToken();

        // Dispatch a custom event that components can listen to
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      }
    }

    // If error is 403 (Forbidden), user doesn't have permission
    if (error.response?.status === 403) {
      // Dispatch a custom event for permission denied
      window.dispatchEvent(
        new CustomEvent("auth:forbidden", {
          detail: { message: error.response.data.message },
        })
      );
    }

    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),

  logout: () => api.post("/api/auth/logout"),

  refreshToken: () => api.post("/api/auth/refresh"),

  getCurrentUser: () => api.get("/api/auth/me"),
};

export const documentsAPI = {
  getDocuments: (params) => api.post("/Documentdtl", params),

  createDocument: (data) => api.post("/api/document", data),

  updateDocument: (id, data) => api.put(`/api/document/${id}`, data),

  getKeywords: (keyword) => api.get("/api/keywords", { params: { keyword } }),
};

export const reportsAPI = {
  getHighValueTransactions: (params) =>
    api.post("/api/high-value-trans", params),

  getSuspiciousCashTransactions: (params) =>
    api.post("/api/suspicious-cash-trans", params),

  getUserRights: (params) => api.post("/api/userright", params),

  transferUserRights: (params) => api.post("/api/userright-transfer", params),
};

export const generalAPI = {
  getBranches: () => api.get("/api/branches"),

  getUsers: () => api.get("/api/Users"),

  getSections: () => api.get("/api/sections"),

  getReportsMenu: () => api.get("/api/reports/menu"),
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 401:
        return {
          type: "UNAUTHORIZED",
          message: data.message || "Please log in to continue",
        };
      case 403:
        return {
          type: "FORBIDDEN",
          message:
            data.message || "You do not have permission to perform this action",
        };
      case 404:
        return {
          type: "NOT_FOUND",
          message: data.message || "Resource not found",
        };
      case 500:
        return {
          type: "SERVER_ERROR",
          message: data.message || "Internal server error",
        };
      default:
        return {
          type: "API_ERROR",
          message: data.message || `Request failed with status ${status}`,
        };
    }
  } else if (error.request) {
    // Network error
    return {
      type: "NETWORK_ERROR",
      message: "Network error. Please check your internet connection.",
    };
  } else {
    // Other error
    return {
      type: "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred",
    };
  }
};

export default api;
