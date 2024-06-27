import { Outlet } from "react-router-dom";

export default function LayoutHome() {
	return (
		<div className="h-screen w-full relative bg-white">
			<Outlet />
		</div>
	);
}
