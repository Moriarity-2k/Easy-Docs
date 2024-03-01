import Navbar from "@/components/Navbar";
// import { socket_url } from "@/constants";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";

// import { io } from "socket.io-client";

export default function Home() {
	// 	useEffect(() => {
	// 		const socket = io(`${socket_url}`);
	//
	// 		socket.on("connect", () => {
	// 			console.log("Connected : ");
	// 		});
	//
	// 		socket.emit("join-room", "id-1234", x);
	//
	// 		socket.on("some-message", (res) => {
	// 			console.log(res);
	// 		});
	// 		socket.on("someone-joined", (res) => {
	// 			console.log(res);
	// 		});
	//
	// 		socket.emit("send-to-rooms", "id-1234", toast("hello"));
	// 	}, []);

	return (
		// <div className="background-light850_dark100">
		<div className="">
			<Navbar />
			<Outlet />

			{/* <div className="flex gap-6">
				<div className="h-20 w-20 bg-dark-100">hello</div>
				<div className="h-20 w-20 bg-dark-200">hello</div>
				<div className="h-20 w-20 bg-dark-300">hello</div>
				<div className="h-20 w-20 bg-dark-400">hello</div>
				<div className="h-20 w-20 bg-dark-500">hello</div>
			</div>

            <div className="flex gap-6">
				<div className="h-20 w-20 bg-light-900">hello</div>
				<div className="h-20 w-20 bg-light-850">hello</div>
				<div className="h-20 w-20 bg-light-800">hello</div>
				<div className="h-20 w-20 bg-light-700">hello</div>
				<div className="h-20 w-20 bg-light-400">hello</div>
				<div className="h-20 w-20 bg-light-500">hello</div>
			</div> */}
			{/* <div className="mt-[8rem] space-x-4">
				<NavLink to="/register">REGISTER</NavLink>
				<NavLink to="/login">LOGIN</NavLink>
				<button
					onClick={() => {
						if (changeTheme) changeTheme();
					}}
				>
					change theme
				</button>
				<CreateDocument />d
			</div> */}
		</div>
	);
}

/**
 * client :
 * socket , socket.emit , socket.on()
 */

/*
server : 

io.on(connection) , io.emit() => for all , socket.broadcast.emit() => all except 

Every user is in a room by himself with his socket id
socket.to(room).emit();
socket.join(room)
*/
