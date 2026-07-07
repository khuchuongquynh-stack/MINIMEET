const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const rooms = {};

function createRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 8; i++) {
        if (i === 4) code += "-";
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}

app.get("/create-room", (req, res) => {

    let room;

    do {
        room = createRoomCode();
    } while (rooms[room]);

    rooms[room] = [];

    res.json({
        room
    });

});

io.on("connection", socket => {

    console.log(socket.id + " connected");

    socket.on("join-room", ({ room, name }) => {

        if (!rooms[room]) {
            rooms[room] = [];
        }

        rooms[room].push({
            id: socket.id,
            name
        });

        socket.join(room);

        io.to(room).emit("participants", rooms[room]);

    });

    socket.on("chat", data => {

        io.to(data.room).emit("chat", data);

    });

    socket.on("emoji", data => {

        io.to(data.room).emit("emoji", data);

    });

    socket.on("disconnect", () => {

        for (const room in rooms) {

            rooms[room] =
                rooms[room].filter(
                    p => p.id !== socket.id
                );

            io.to(room).emit(
                "participants",
                rooms[room]
            );

        }

    });

});

server.listen(PORT, () => {

    console.log("MiniMeet");
    console.log("Running on port " + PORT);

});