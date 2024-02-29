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
	console.log(socket);

});

http_server.listen(4000, () => {
	console.log("http server");
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

// const PORT = process.env.PORT || 3000;
// 
// const server = app.listen(PORT, () => {
// 	console.log("Server connected : ", PORT);
// });
//
// process.on("unhandledRejection", (reason) => {
// 	console.log("Error unhandledRejection : ", reason);
// 	server.close(() => process.exit(1));
// });
