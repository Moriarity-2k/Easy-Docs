import { config as dotEnvConfig } from "dotenv";
dotEnvConfig({});

import app from "./app";
// import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";

process.on("uncaughtException", (err) => {
	console.log("Error uncaught exception : ", err);
	process.exit(1);
});

const http_server = http.createServer(app);

const io = new Server(http_server, {
	cors: {
		// origin: process.env.CLIENT_ORIGIN_URL,
		origin: process.env.CLIENT_ORIGIN_DEPLOY_URL,
		// origin: "http://localhost:5173",
	},
});

io.on("connection", (socket) => {
	socket.on("join-room", (...args) => {
		// console.log(args);
		socket.join(args[0]);
		socket.broadcast.to(args[0]).emit("someone-joined", args[1]);
	});

	socket.on("send-to-rooms", async (...args) => {
		socket.broadcast
			.to(args[0])
			.emit("change-in-content-from-server", args[1]);
	});

	socket.on("disconnect", () => {
		// console.log("Disconnected");
		socket.disconnect();
	});
});

const PORT = process.env.PORT || 3000;

http_server.listen(PORT, () => {
	console.log("http server on : ", PORT);
});


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection : " , err)
	http_server.close(() => process.emit("beforeExit", 1));
});
