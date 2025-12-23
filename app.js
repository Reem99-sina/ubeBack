const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectdb } = require("./connect");
const routeruSER = require("./router/user.router");
const { User } = require("./module/user");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/user", routeruSER);

connectdb();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.data.email = null;

  socket.on("login", async (payload) => {
    console.log(payload, "payload");
    try {
      const { email } = payload || {};
      if (!email) return;
      socket.data.email = email;
      const user = await User.findOneAndUpdate(
        { email },
        { active_status: true },
        { new: true } // 👈 return updated user
      );
      io.emit("userStatusChanged", { user });
    } catch (err) {
      console.error("socket login error", err);
    }
  });

  socket.on("logout", async (payload) => {
    console.log(payload, "payload");

    try {
      const { email } = payload || {};
      const userEmail = email || socket.data.email;
      if (!userEmail) return;
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { active_status: false },
        { new: true }
      );
      io.emit("userStatusChanged", { user });
      socket.data.email = null;
    } catch (err) {
      console.error("socket logout error", err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const email = socket.data.email;
      if (!email) return;
      await User.findOneAndUpdate({ email }, { active_status: false });
      io.emit("userStatusChanged", { email, active_status: false });
    } catch (err) {
      console.error("socket disconnect error", err);
    }
  });
});

const PORT = process.env.PORT || 1200;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
