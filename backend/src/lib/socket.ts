import { Server } from "socket.io";

export const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  io.emit("event:enter", {
    id: Math.random().toString(36).substring(2, 15),
    user: socket.id,
  });

  socket.on("event:message", (data) => {
    console.log(`New message received: ${data.message} | From: ${socket.id}`);

    io.emit("event:message", {
      id: Math.random().toString(36).substring(2, 15),
      user: socket.id,
      message: data.message,
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    io.emit("event:leave", {
      id: Math.random().toString(36).substring(2, 15),
      user: socket.id,
    });
  });
});
