// lib/editorSocket.ts
import { io, Socket } from "socket.io-client";

let editorSocket: Socket | null = null;

export function getEditorSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!editorSocket) {
    const base = process.env.NEXT_PUBLIC_EDITOR_SOCKET_URL || "";
    const namespace = "/workspace";
    const url = base ? `${base}${namespace}` : namespace; // same-origin namespace if base is empty
    editorSocket = io(url, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return editorSocket;
}
