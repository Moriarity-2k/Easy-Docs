import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./theme.css";
import { StrictMode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./v2/components/ErrHandler/ErrHandler.tsx";
import { FallBackUi } from "./v2/components/ErrHandler/SuspenseFallback.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => window.location.replace("/")}
		>
			<Suspense fallback={<FallBackUi />}>
				<App />
			</Suspense>
		</ErrorBoundary>
	</StrictMode>
);
