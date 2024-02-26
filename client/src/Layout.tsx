import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-poppins background-light900_dark200 w-full mx-auto">
			{children}
		</div>
	);
}
