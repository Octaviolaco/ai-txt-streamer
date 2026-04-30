import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket) {
    socket = io(`${BACKEND_URL}/chat`, {
      extraHeaders: {
        authorization: `Bearer ${token}`, // On injecte le JWT ici !
      },
      autoConnect: false, // On contrôle manuellement la connexion
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};