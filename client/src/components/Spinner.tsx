import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface IClipLoader {
	color?: string;
	sz?: number;
}

export default function Spinner({ color, sz }: IClipLoader) {
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
