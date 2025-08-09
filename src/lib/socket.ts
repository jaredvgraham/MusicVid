// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || undefined; // if unset, same-origin
    socket = io(url, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}
