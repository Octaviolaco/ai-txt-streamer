import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

let socket: Socket | null = null;

export const getSocket = (token: string, forceNew = false) => {
  if (forceNew && socket) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io(`${BACKEND_URL}/chat`, {
      // ⚠️ On remplace extraHeaders par auth !
      auth: {
        token: token, 
      },
      autoConnect: false,
      forceNew: true, // ⚠️ Crucial: empêche Socket.io de recycler les vieux headers en cache
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