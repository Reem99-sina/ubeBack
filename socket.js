const { User } = require("./module/user");

// socket.js
let io = null;
const onlineUsers = new Map();
const onlineDrivers = new Map();

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("login", async (payload) => {
      console.log(payload, "payload");
      try {
        const id = payload || {};
        if (!id) return;

        await User.findByIdAndUpdate(
          id,
          {
            $addToSet: { sockets: socket.id },
            active_status: true,
          },
          { new: true },
        );
        io.emit("userStatusChanged", { user });
      } catch (err) {
        console.error("socket login error", err);
      }
    });

    socket.on("logout", async (payload) => {
      console.log(payload, "payload");

      try {
        const id = payload || {};

        if (!id) return;

        const user = await User.findByIdAndUpdate(
          id,
          {
            $pull: { sockets: socket.id },
            active_status: false,
          },
          { new: true },
        );
        io.emit("userStatusChanged", { user });
        socket.data.email = null;
      } catch (err) {
        console.error("socket logout error", err);
      }
    });

    // ✅ Register user
    socket.on("loginUser", async (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User registered:", userId);
    });

    // ✅ Register driver
    socket.on("loginDriver", (driverId) => {
      onlineDrivers.set(driverId, socket.id);
      console.log("Driver registered:", driverId);
    });

    // ✅ Driver responds to ride
    socket.on("rideResponse", ({ userId, driverId, status }) => {
      const userSocketId = onlineUsers.get(userId);

      if (userSocketId) {
        io.to(userSocketId).emit("rideResponse", {
          driverId,
          status,
        });
      }
    });

    // ❌ Disconnect cleanup
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);

      for (let [key, value] of onlineUsers) {
        if (value === socket.id) onlineUsers.delete(key);
      }

      for (let [key, value] of onlineDrivers) {
        if (value === socket.id) onlineDrivers.delete(key);
      }
    });
  });
  return io;
}

function getIo() {
  if (!io) {
    throw new Error(
      "Socket.io not initialized! Call initSocket(server) first.",
    );
  }
  return io;
}

module.exports = { initSocket, getIo, onlineDrivers, onlineUsers };
