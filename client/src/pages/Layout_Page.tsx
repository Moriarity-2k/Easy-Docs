import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function Home() {
	const height = window.innerHeight * (0.4 + 0.4 + 0.03);
	return (
		<div className="">
			<Navbar />
			<div className="" style={{ minHeight: height }}>
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}


