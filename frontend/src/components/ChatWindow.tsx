"use client";

import { useState, useEffect, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { Send, Loader2 } from "lucide-react"; 
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow(props: {
  emptyStateComponent: React.ReactNode;
  placeholder?: string;
  emoji?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { token, logout } = useAuth();
  const [socket, setSocket] = useState<any>(null);

  // Auto-scroll en bas à chaque nouveau message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gestion de la connexion WebSocket
  useEffect(() => {
    if (!token) return;

    // Fonction encapsulée pour pouvoir la rappeler avec un nouveau token
    const connectAndListen = (currentToken: string, isRefresh = false) => {
      // ⚠️ IMPORTANT: Si isRefresh est true, ça détruit l'ancien socket !
      const s = getSocket(currentToken, isRefresh);
      setSocket(s);
      s.connect();

      // --- ÉCOUTE DES MESSAGES ---
      s.on("ai_response", (chunk: string) => {
        setIsLoading(false);
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + chunk,
            };
            return newMessages;
          }
          return [...prev, { id: Date.now().toString(), role: "assistant", content: chunk }];
        });
      });

      // --- ÉCOUTE DES ERREURS (GUARD NESTJS) ---
      s.on("exception", async (err: any) => {
        setIsLoading(false); // On casse la boucle de chargement
        console.error("Erreur WebSocket Guard:", err);

        // Le Guard NestJS renvoie souvent "Internal server error" au lieu de 401 en WS
        if (err.message === "Internal server error" || err.status === "error" || err.message === "Unauthorized") {
          try {
            console.log("🔄 Token expiré détecté par le WebSocket. Rafraîchissement...");
            
            const username = localStorage.getItem("username");
            const refreshToken = localStorage.getItem("refresh_token");
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
            
            // On appelle directement la route de refresh en POST
            const res = await axios.post(`${backendUrl}/auth/refresh/acess_token`, {
              username: username,
              refresh_token: refreshToken
            });
            
            const newToken = res.data.access_token || res.data; 
            localStorage.setItem("access_token", newToken);
            
            console.log("✅ Nouveau token obtenu, reconnexion...");
            // On relance la fonction avec le paramètre forceNew à true !
            connectAndListen(newToken, true);

          } catch (refreshErr) {
            console.error("❌ Échec critique du rafraîchissement, déconnexion.");
            logout();
          }
        }
      });
    };

    // Lancement initial
    const initialToken = localStorage.getItem("access_token") || token;
    connectAndListen(initialToken);

    // Nettoyage quand on quitte la page
    return () => {
      disconnectSocket();
    };
  }, [token]);

  // Envoi d'un message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true); // Lance le spinner

    socket.emit("NewMessage", { text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f5] dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            {props.emptyStateComponent}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => (
              <ChatMessageBubble key={m.id} message={m} aiEmoji={props.emoji} />
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder={props.placeholder || "Écrivez votre message..."}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-2">
          Propulsé par ton backend NestJS personnalisé
        </p>
      </footer>
    </div>
  );
}