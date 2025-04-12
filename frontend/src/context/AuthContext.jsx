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
      if (!import.meta.env.VITE_API_AUTH) {
        throw new Error("Authentication service unavailable");
      }

      const loginUrl = `${import.meta.env.VITE_API_AUTH}/login`;
      const res = await axios.post(
        loginUrl,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data || !res.data.user) {
        throw new Error("Invalid response from server");
      }

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      // Clean error handling without exposing details
      if (err.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        throw new Error("Login failed. Please try again later.");
      }
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
