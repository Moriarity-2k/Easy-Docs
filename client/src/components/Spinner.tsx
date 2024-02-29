import { CSSProperties } from "react";
import { createPortal } from "react-dom";
import ClipLoader from "react-spinners/ClipLoader";
import BarLoader from "react-spinners/BarLoader";

interface IClipLoader {
	color?: string;
	sz?: number;
}

export function ClipSpinner({ color, sz }: IClipLoader) {
	const override: CSSProperties = {
		display: "block",
		margin: "0 auto",
		borderColor: color,
	};
	return (
		<ClipLoader
			color={color}
			loading={true}
			cssOverride={override}
			size={sz}
			aria-label="Loading Spinner"
			data-testid="loader"
		/>
	);
}

export function SpiralSpinner({ color, sz }: IClipLoader) {
	const override: CSSProperties = {
		display: "block",
		margin: "0 auto",
		borderColor: color,
	};
	// return (
	// 	<RingLoader
	// 		// color={color}
	// 		loading={true}
	// 		cssOverride={override}
	// 		size={sz}
	// 		aria-label="Loading Spinner"
	// 		data-testid="loader"
	// 		className="z-10 absolute top-0 left-0 flex-center h-screen w-full backdrop:blur-md"
	// 	/>
	// );

	return createPortal(
		<div className="backdrop-blur-lg w-full h-screen absolute top-0 left-0 flex-center">
			<div className="card-wrapper">
				<BarLoader
					color={color}
					loading={true}
					cssOverride={override}
					size={300}
					aria-label="Loading Spinner"
					data-testid="loader"
					className="z-10 absolute top-0 left-0 flex-center h-screen w-full backdrop:blur-sm"
				/>
			</div>
			{/* {children} */}
		</div>,
		document.querySelector("#root")!
	);
}
