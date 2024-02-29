import CreateDocument from "@/components/CreateDocument";
import { useTheme } from "@/context/useTheme";
import axios from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { io } from "socket.io-client";

export default function Home() {
	const { currentTheme } = useTheme();
	const theme = currentTheme && currentTheme();

	useEffect(() => {
		const socket = io("http://localhost:4000/");

		socket.on("connect", () => {
			console.log("Connected : ");
		});
	}, []);

	return (
		<div className="bg-light-800 space-x-4">
			<NavLink to="/register">REGISTER</NavLink>
			<NavLink to="/login">LOGIN</NavLink>

			<CreateDocument />
		</div>
	);
}
