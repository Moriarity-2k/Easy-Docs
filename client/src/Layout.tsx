import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-poppins w-full min-h-screen box-border mx-auto bg-light-800 dark:bg-dark-100">
			{children}
		</div>
	);
}
