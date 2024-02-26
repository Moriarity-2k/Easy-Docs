import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/useTheme";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Layout>
					<RouterProvider router={router} />
				</Layout>
			</ThemeProvider>
			<Toaster
				toastOptions={{
					success: {
						iconTheme: { primary: "#3530d1", secondary: "#fff" },
					},
					error: {
						iconTheme: { primary: "#D24545", secondary: "#fff" },
					},
				}}
			/>
		</QueryClientProvider>
	);
}

export default App;
