import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./theme.css";
import { StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrHandler.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => window.location.replace("/")}
		>
			<App />
		</ErrorBoundary>
	</StrictMode>
);
