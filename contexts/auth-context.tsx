"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const userRegistered = localStorage.getItem("userRegistered");
      const userEmail = localStorage.getItem("userEmail");
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      const userName = localStorage.getItem("userName");

      if (userRegistered && userEmail && userLoggedIn && userName) {
        setUser({ email: userEmail, name: userName });
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - check if user is registered
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");
    
    if (storedEmail === email && storedPassword === password) {
      const userName = localStorage.getItem("userName") || "Student";
      localStorage.setItem("userLoggedIn", "true");
      setUser({ email, name: userName });
      setIsAuthenticated(true);

      // Log user activity
      try {
        await fetch('/api/log-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: email, email: email, name: userName }), // Assuming email as userId for this example
        });
      } catch (error) {
        console.error("Failed to log user login:", error);
      }

      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Validate JIIT email
    if (!email.endsWith("@mail.jiit.ac.in")) {
      return false;
    }

    // Store user data
    localStorage.setItem("userRegistered", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("userName", name);
    localStorage.setItem("userLoggedIn", "true");
    
    setUser({ email, name });
    setIsAuthenticated(true);

    // Log user activity
    try {
      await fetch('/api/log-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email, email: email, name: name }), // Assuming email as userId
      });
    } catch (error) {
      console.error("Failed to log user signup:", error);
    }

    return true;
  };

  const logout = () => {
    localStorage.removeItem("userLoggedIn");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
