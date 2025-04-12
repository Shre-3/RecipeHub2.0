import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user"); // Remove invalid data
        }
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user"); // Remove invalid data
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Debug logs
      console.log("All env variables:", {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_API_AUTH: import.meta.env.VITE_API_AUTH,
        VITE_API_BOOKMARKS: import.meta.env.VITE_API_BOOKMARKS,
        VITE_API_AI: import.meta.env.VITE_API_AI,
        VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
      });

      if (!import.meta.env.VITE_API_AUTH) {
        throw new Error("VITE_API_AUTH environment variable is not defined");
      }

      const loginUrl = `${import.meta.env.VITE_API_AUTH}/login`;
      console.log("Attempting login at:", loginUrl);
      console.log("With payload:", { email, password });

      const res = await axios.post(
        loginUrl,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Debug response
      console.log("Login response:", res.data);

      if (!res.data || !res.data.user) {
        throw new Error("Invalid response format from server");
      }

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
      });

      // Clean up any invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);

      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_AUTH}/register`,
        {
          username,
          email,
          password,
        }
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "An error occurred";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
