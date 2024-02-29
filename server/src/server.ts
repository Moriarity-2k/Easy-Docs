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

io.on("connection", (socket) => {
	// console.log(socket);
	// io.("join-room", (...args) => {
	// 	console.log(args);
	// 	console.log("join-room");
	// });
	socket.on("join-room", (...args) => {
		console.log(args);
		io.emit("some-message", "added : ");
	});

    // socket.broadcast.emit()
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
