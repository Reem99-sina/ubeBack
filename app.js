const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectdb } = require("./connect");
const routeruSER = require("./router/user.router");
const routerTrip = require("./router/trip.router");


const { User } = require("./module/user");
const { initSocket } = require("./socket");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/user", routeruSER);
app.use("/trip",routerTrip );


connectdb();

const server = http.createServer(app);

const io = initSocket(server);

io.on("connection", (socket) => {
  socket.data.email = null;

});

const PORT = process.env.PORT || 1200;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));