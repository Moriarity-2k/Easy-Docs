import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import RingLoader from "react-spinners/RingLoader";

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
	return (
		<RingLoader
			color={color}
			loading={true}
			cssOverride={override}
			size={sz}
			aria-label="Loading Spinner"
			data-testid="loader"
		/>
	);
}

