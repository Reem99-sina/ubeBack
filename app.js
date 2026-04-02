const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectdb } = require("./connect");
const routeruSER = require("./router/user.router");
const routerTrip = require("./router/trip.router");
const mainRouter = require("./service/main");


const { User } = require("./module/user");
const { initSocket, onlineDrivers, onlineUsers } = require("./socket");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/user", routeruSER);
app.use("/trip",routerTrip );
app.use("/payment", mainRouter); // Add this line to include payment routes


connectdb();

const server = http.createServer(app);

const io = initSocket(server);

console.log("Server is running...",onlineDrivers,onlineUsers);
const PORT = process.env.PORT || 1200;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));