import { Button } from "./ui/button";

export default function ErrorFallback({
	error,
	resetErrorBoundary,
}: {
	error: any;
	resetErrorBoundary: any;
}) {
	return (
		<div className="h-screen flex-center background-light850_dark100 text-light800_dark300">
			<div className="base-semibold">Sorry something went wrong</div>
			<p className="text-red-500">{error.message}</p>
			<Button
				type="submit"
				onClick={resetErrorBoundary}
				className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest"
			>
				Try Again
			</Button>
		</div>
	);
}