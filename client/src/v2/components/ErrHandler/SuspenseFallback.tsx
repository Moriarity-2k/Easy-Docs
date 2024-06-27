import "./Suspense.css";

export const FallBackUi = () => {
	return (
		<div className="h-screen w-full flex items-center justify-center bg-[#0a0425]">
			<div className="pacman flex items-center">
				<div className="text-white mr-8 font-mono font-bold">
					Loading
				</div>
				<div className="">
					<div className="pacman-top"></div>
					<div className="pacman-bottom"></div>
				</div>
				<div className="feed"></div>
			</div>
		</div>
	);
};
