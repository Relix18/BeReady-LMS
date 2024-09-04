import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("socketio connected");

    socket.on("notification", (data) => {
      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      console.log("socketio disconnected");
    });
  });
};
