import React, { createContext, useReducer, useEffect } from "react";

// API base URL configuration
const API_BASE =
  import.meta.env.VITE_API_URL || "https://lmrk-backend-pmnr.vercel.app";

// Create the authentication context
const AuthContext = createContext();

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Store token in localStorage
  const setTokenInStorage = (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  // Get token from localStorage
  const getTokenFromStorage = () => {
    return localStorage.getItem("accessToken");
  };

  // Login function
  const login = async (username, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Try the old login endpoint first for testing
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.User_Name) {
        // Old endpoint returns user data directly
        const fakeToken = "test-token-" + Date.now(); // Temporary token for testing
        setTokenInStorage(fakeToken);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: {
              userId: data.User_ID || 1,
              username: data.User_Name,
              role: "user",
            },
            token: fakeToken,
          },
        });

        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: data.message || "Login failed",
        });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Network error. Please check your connection.";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  }; // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side cookies
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      // Clear local storage and state regardless of server response
      setTokenInStorage(null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setTokenInStorage(data.data.accessToken);

        dispatch({
          type: AUTH_ACTIONS.REFRESH_TOKEN,
          payload: {
            user: data.data.user,
            token: data.data.accessToken,
          },
        });

        return true;
      } else {
        // Refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  // Check if user is authenticated on app load
  const checkAuthStatus = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    const token = getTokenFromStorage();

    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      // Verify token with backend
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: data.data.user,
            token: token,
          },
        });
      } else {
        // Token is invalid, try to refresh
        const refreshed = await refreshToken();
        if (!refreshed) {
          setTokenInStorage(null);
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setTokenInStorage(null);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Initialize auth state on mount
  useEffect(() => {
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh token before expiration (every 20 minutes)
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        refreshToken();
      }, 20 * 60 * 1000); // 20 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Context value
  const value = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
