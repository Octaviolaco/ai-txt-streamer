import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000/chat";

export const socket = io(
    URL,
    {autoConnect: true, reconnection: true}
)
