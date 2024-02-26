import CreateDocument from "@/components/CreateDocument";
import { NavLink } from "react-router-dom";

export default function Home() {
	return (
		<div className="flex-center gap-8">
			<NavLink to="/register">REGISTER</NavLink>
			<NavLink to="/login">LOGIN</NavLink>

            <CreateDocument />
		</div>
	);
}
