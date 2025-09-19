import { createContext, useContext } from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../apiClient";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await apiClient.post("/api/token/");
        setAccessToken(response.data.access);
      } catch {
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccessToken();
  }, []);

  // Interceptor para la solicitud
  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && accessToken
          ? `Bearer ${accessToken}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            const response = await apiClient.post("/api/token/refresh/");
            setAccessToken(response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            originalRequest._retry = true;
            return apiClient(originalRequest);
          } catch {
            setAccessToken(null);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = (token) => {
    setAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
  };

  const isAuthenticated = () => {
    if (!accessToken) return false;

    try {
      const decoded = jwtDecode(accessToken);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  const value = {
    accessToken,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-Order Component for protecting routes
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!accessToken) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

// Custom hook for components that need auth checks
export const useRequireAuth = () => {
  const { accessToken, isAuthenticated } = useAuth();

  if (!accessToken || !isAuthenticated()) {
    throw new Error("Authentication required");
  }

  return accessToken;
};
