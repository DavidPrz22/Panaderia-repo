import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/client";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { DoubleSpinner } from "@/assets";

// Extend the axios config type to include our custom _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>; // Updated to async
  refreshToken: () => Promise<string | null>; // Updated return type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (!accessToken) return false;

    try {
      const decoded = jwtDecode(accessToken);
      return decoded.exp! > Date.now() / 1000;
    } catch {
      return false;
    }
  }, [accessToken]);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  // Helper function for logout cleanup
  const clearAuthState = useCallback(async () => {
    // Try to clear server-side cookie, but don't block on failure
    apiClient
      .post("/api/logout/")
      .catch((error) => console.error("Logout request failed:", error));

    // Always clear local state
    clearAuth();
    navigate("/login");
  }, [navigate, clearAuth]);

  // Update refresh function with debugging
  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await apiClient.post("/api/token/refresh/");
      const newAccessToken = response.data.access;
      console.log("New access token:", newAccessToken);

      setAccessToken(newAccessToken);
      return newAccessToken; // Return the new token
    } catch (error) {
      console.error(
        "Token refresh failed:",
        (error as AxiosError).response?.data,
      );
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  // Login function
  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      try {
        setIsLoading(true);
        const response = await apiClient.post("/api/token/", credentials);

        const { access, userData } = response.data; // Note: userData, not user

        setAccessToken(access);
        setUser(userData);

        navigate("/dashboard");
      } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        console.error("Error response:", axiosError.response?.data);
        throw new Error(axiosError.response?.data?.detail || "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  // Logout function
  const logout = useCallback(async () => {
    await clearAuthState();
  }, [clearAuthState]);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken();
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshToken]);

  // Setup axios interceptors
  useLayoutEffect(() => {
    // Request interceptor to add auth header
    const requestInterceptor = apiClient.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        if (accessToken && !config._retry) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          accessToken
        ) {
          originalRequest._retry = true;

          const newToken = await refreshToken(); // Get the new token directly
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptors
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOC for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <img src={DoubleSpinner} alt="Loading" className="size-40" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook for components that require authentication
export const useRequireAuth = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    throw new Error("Authentication required");
  }

  return user;
};
