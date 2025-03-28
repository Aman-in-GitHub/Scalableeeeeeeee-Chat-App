import { Server } from "socket.io";
import { pub, sub } from "@/lib/redis.ts";
import * as crypto from "node:crypto";

export type MessageType = {
  id: string;
  user: string;
  message?: string;
  timestamp: string;
};

export const io = new Server({
  cors: {
    origin: "*",
  },
});

function createMessage(user: string, message?: string): MessageType {
  return {
    id: crypto.randomUUID(),
    user,
    message,
    timestamp: new Date().toISOString(),
  };
}

async function publisher(channel: string, message: MessageType) {
  await pub.publish(channel, JSON.stringify(message));
}

async function setUpSubscriptions() {
  await sub.subscribe("Message", (message: string) => {
    io.emit("event:message", JSON.parse(message));
  });

  await sub.subscribe("Enter", (message: string) => {
    io.emit("event:enter", JSON.parse(message));
  });

  await sub.subscribe("Leave", (message: string) => {
    io.emit("event:leave", JSON.parse(message));
  });
}

export async function init() {
  await setUpSubscriptions();

  io.on("connection", async (socket) => {
    console.log(`New user connected: ${socket.id}`);

    await publisher("Enter", createMessage(socket.id));

    socket.on("event:message", async (data: { message: string }) => {
      console.log(`New message: ${data.message} | From: ${socket.id}`);

      await publisher("Message", createMessage(socket.id, data.message));
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);

      await publisher("Leave", createMessage(socket.id));
    });
  });
}

init();
