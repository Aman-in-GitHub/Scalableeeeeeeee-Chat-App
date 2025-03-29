import React from "react";
import io, { Socket } from "socket.io-client";
import { MessageType } from "../../backend/src/lib/socket.ts";
import { toast } from "sonner";

type ExtendedMessageType = MessageType & {
  status?: "enter" | "leave";
};

type SocketContextType = {
  socket: Socket | null;
  activeUsers: number;
  messages: ExtendedMessageType[];
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
  const [activeUsers, setActiveUsers] = React.useState(0);
  const [messages, setMessages] = React.useState<ExtendedMessageType[]>([]);

  React.useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setSocket(socket);
      toast.success("Connected to chat server");
    });
    socket.on("event:enter", (data) => {
      if (data.user !== socket.id) {
        console.log(`${data.user} connected`);
        toast.info(`${data.user} joined the chat`);
        data.status = "enter";
        setMessages((prev) => [...prev, data]);
      }
    });
    socket.on("event:leave", (data) => {
      if (data.user !== socket.id) {
        console.log(`${data.user} disconnected`);
        toast.error(`${data.user} left the chat`);
        data.status = "leave";
        setMessages((prev) => [...prev, data]);
      }
    });
    socket.on("event:message", handleMessages);
    socket.on("event:activeUsers", (data) => {
      setActiveUsers(data);
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
    <SocketContext.Provider
      value={{ activeUsers, socket, messages, sendMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
}
