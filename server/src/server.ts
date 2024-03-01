import { config as dotEnvConfig } from "dotenv";
dotEnvConfig({});
import cors from "cors";

import app from "./app";
import path from "path";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import { Router } from "express";
// import { Request, Response, Router, json } from "express";
// import express from "express";

process.on("uncaughtException", (err) => {
	console.log("Error uncaught exception : ", err);
	process.exit(1);
});

const http_server = http.createServer(app);

const io = new Server(http_server, {
	cors: {
		origin: "http://localhost:5173",
	},
});

// const map = new Map<[string, string], boolean>();

io.on("connection", (socket) => {
	socket.on("join-room", (...args) => {
		console.log(args);
		socket.join(args[0]);
		socket.broadcast.to(args[0]).emit("someone-joined", args[1]);
	});

	socket.on("send-to-rooms", (...args) => {
		console.log({ CONTENT: args[1], ROOM: args[0] });
		socket.broadcast
			.to(args[0])
			.emit("change-in-content-from-server", args[1]);
	});

	socket.on("disconnect", () => {
		console.log("Disconnected");
		socket.disconnect();
	});

	console.log({ size: io.sockets.sockets.size });
	// for (const x of io.sockets.sockets) {
});

const PORT = process.env.PORT || 3000;

http_server.listen(PORT, () => {
	console.log("http server on : ", PORT);
});

// const ioServer = new Server({
// 	cors: {
// 		origin: "http://localhost:5173",
// 	},
// });
//
// ioServer.listen(8000);
//
// ioServer.on("connection", (socket) => {
// 	console.log("SOCKET ", socket.id);
// });

const DB = process.env.DATABASE!;
mongoose
	.connect(DB)
	.then(() => {
		console.log("DB Connected ...");
	})
	.catch((reason: any) => {
		console.log("DB ERROR : ", reason);
	});

//
// const server = app.listen(PORT, () => {
// 	console.log("Server connected : ", PORT);
// });
//
// process.on("unhandledRejection", (reason) => {
// 	console.log("Error unhandledRejection : ", reason);
// 	server.close(() => process.exit(1));
// });
