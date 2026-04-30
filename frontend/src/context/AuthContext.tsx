"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // login par la route du backend
    setIsLoading(true);
    const response = await api.post("/auth/login", { username, password });
    
    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token; 
    
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    
    setIsLoading(false);
    setToken(newAccessToken);
  };

  const logout = async () => {
    //logout: supprimer les tokens du localStorage ET du backend
    setIsLoading(true);
    const response = await api.post("/auth/logout", {"access_token": token, "refresh_token": localStorage.getItem("refresh_token")});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setToken(null);
    setIsLoading(false);
    console.log(response.data.message);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};