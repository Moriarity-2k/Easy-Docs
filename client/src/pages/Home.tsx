import CreateDocument from "@/components/CreateDocument";
import { useTheme } from "@/context/useTheme";
import { NavLink } from "react-router-dom";

export default function Home() {
	const { currentTheme } = useTheme();
	const theme = currentTheme && currentTheme();

	return (
		<div className="bg-light-800">
			<NavLink to="/register">REGISTER</NavLink>
			<NavLink to="/login">LOGIN</NavLink>

			<CreateDocument />
		</div>
	);
}
