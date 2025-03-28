import React from "react";
import io, { Socket } from "socket.io-client";
import { MessageType } from "../../backend/src/lib/socket.ts";

type SocketContextType = {
  socket: Socket | null;
  messages: MessageType[];
  sendMessage: (message: string) => void;
};

const SocketContext = React.createContext<SocketContextType | null>(null);

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  React.useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    socket.on("event:message", handleMessages);
    socket.on("event:enter", (data) => {
      console.log(`${data.user} connected`);
    });
    socket.on("event:leave", (data) => {
      console.log(`${data.user} disconnected`);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  async function sendMessage(message: string) {
    if (socket) {
      socket.emit("event:message", { message: message });
    }
  }

  async function handleMessages(data: MessageType) {
    setMessages((prev) => [...prev, data]);
  }

  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}
