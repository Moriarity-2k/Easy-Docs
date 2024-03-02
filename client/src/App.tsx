import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/useTheme";
import Home from "./pages/Layout_Page";
import Document_Editor from "./pages/Document";
import AuthProvider from "./context/useAuth";
import Intro from "./pages/Home";
import Account from "./pages/Account";
import IntroUser from "./components/IntroUser";
import DocumentAccessRequest from "./pages/DocumentAccessRequest";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		children: [
			{
				path: "/",
				element: <Intro />,
			},
			{
				path: "/all-documents",
				element: <IntroUser />,
			},
			{
				path: "/notifications",
				element: <DocumentAccessRequest />,
			},
			{
				path: "/my-account",
				element: <Account />,
			},
			{
				path: "/document/:slug",
				element: <Document_Editor />,
			},
		],
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
			<AuthProvider>
				<ThemeProvider>
					<Layout>
						<RouterProvider router={router} />
					</Layout>
				</ThemeProvider>
			</AuthProvider>
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
