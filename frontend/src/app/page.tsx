"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { token, isLoading, logout } = useAuth();
  console.log("Token actuel dans Home:", token, "isLoading:", isLoading);
  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  // Si pas de token = Utilisateur non connecté -> On affiche le login
  if (!token) {
    return <LoginForm />;
  }

  const WelcomeMessage = (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-3xl">⚡</div>
      <h2 className="text-2xl font-semibold mb-3">Bienvenue sur ton nouveau Chat</h2>
      <button onClick={logout} className="mt-4 text-sm text-destructive underline">Me déconnecter</button>
    </div>
  );

  // Si token présent = Utilisateur connecté -> On affiche le chat
  return (
    <ChatWindow
      emoji="🤖"
      placeholder="Pose-moi une question..."
      emptyStateComponent={WelcomeMessage}
    />
  );
}