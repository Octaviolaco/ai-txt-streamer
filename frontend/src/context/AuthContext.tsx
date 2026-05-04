"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
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

  useEffect(()=>{
    if (!token) return;
    const interval = setInterval(async () =>{
      const username = localStorage.getItem('username')
      const refresh_token = localStorage.getItem('refresh_token')

      if (username && refresh_token){
        try {
          console.log('rotating refresh token')
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh/refresh_token`, {
            username: username,
            refresh_token: refresh_token
          });
        } catch (error){
          console.error("failed rotation: error = ", error)
        }
      }
    }, 14*60*1000) //14mn, car refreshtoken dure 15mn

    return () => clearInterval(interval);
  },[token])

  const login = async (username: string, password: string) => {
    // login par la route du backend
    setIsLoading(true);
    console.log('entering login with ',username,password)
    const response = await api.post("/auth/login", { username, password });
    
    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token; 
    
    console.log("accessToken:",newAccessToken)
    console.log("refreshToken:",newRefreshToken)
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("username",username)
    
    setIsLoading(false);
    setToken(newAccessToken);
  };

  const register = async (username:string, password: string) => {
    setIsLoading(true)
    await api.post("auth/register", {username,password})
    console.log('registered!')
    await new Promise(resolve=>setTimeout(resolve,3000)) //attends 3sec que la db se mette à jour

    await login(username,password)
  }

  const logout = async () => {
    //logout: supprimer les tokens du localStorage ET du backend
    setIsLoading(true);
    try {
      await api.post("/auth/logout", {
        "access_token": token, 
        "refresh_token": localStorage.getItem("refresh_token")
      });
    } catch (error) {console.error("Error in logging out, forced cleaning of local storage anyways")}

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem('username')

    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};