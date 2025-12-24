import React, { useState, useEffect, useCallback } from "react";
import { initFirebase, requestPermissionAndRegister, onMessageListener } from "../utils/pushNotifications";
import { authAPI } from "../api/auth";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";

// Token management
const TOKEN_KEY = "gameday_token";
const USER_KEY = "gameday_user";

// Helper to get stored auth data
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch (error) {
    console.error("Error reading auth data from storage", error);
  }
  return { token: null, user: null };
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage and validate token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token: storedToken, user: storedUser } = getStoredAuth();

        if (storedToken && storedUser) {
          // Verify token is still valid
          try {
            const userData = await authAPI.getMe();
            setUser(userData);
            setToken(storedToken);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
          } catch (error) {
            console.warn("Session expired or invalid (expected during logout/expiry):", error.message);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    initFirebase();

    // Set up push notification listener
    const unsubscribe = onMessageListener((payload) => {
      // console.log("Foreground push:", payload);
      // Handle push notification
      if (payload?.notification) {
        toast(payload.notification.title + ": " + payload.notification.body, {
          icon: "🔔",
          duration: 5000,
        });
      }
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Load user error:", error);
    }
  }, []);

  const login = useCallback(async (token) => {
    try {
      const response = await authAPI.googleLogin(token);
      const { user: userData, token: authToken } = response;

      // Store auth data
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setUser(userData);
      setToken(authToken);

      // Request notification permission after successful login
      try {
        await requestPermissionAndRegister();
      } catch (err) {
        console.warn("Notification permission not granted:", err.message);
      }

      return response; // Return full response to check requiresUsername
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear auth data
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Reset state
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateUser,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
