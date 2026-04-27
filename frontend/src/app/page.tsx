"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function ChatPage() {
  useEffect(() => {
    function onConnect() {
      console.log("Connecté au serveur !");
    }

    function onAiResponse(chunk: string) {
      console.log("Morceau reçu de l'IA :", chunk);
    }

    socket.on("connect", onConnect);
    socket.on("ai_response", onAiResponse);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("ai_response", onAiResponse);
      socket.disconnect();
    };
  }, []);

  return <div>Mon Chat de l'IA</div>;
}
