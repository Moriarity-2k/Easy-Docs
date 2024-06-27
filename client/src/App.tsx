import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**
 * Page Imports
 */
import Layout from "./Layout";
import LayoutHome from "./v2/pages/LayoutHome";
import Register from "./v2/pages/Register";
import Login from "./v2/pages/Login";
import Documents from "./v2/pages/Documents";
import DocumentAccessCheck from "./v2/pages/DocumentAccessCheck";
import Account from "./v2/pages/Account";
import Notifications from "./v2/components/Account/Notifications";
import UserNameUpdate from "./v2/components/Account/UserNameUpdate";
import PasswordUpdateForm from "./v2/components/Account/PasswordUpdateForm";
import AuthProvider from "./context/useAuth";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <LayoutHome />,
		children: [
			{
				path: "/",
				element: <Documents />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/document/:slug",
				// element: <TinyEditor />,
				element: <DocumentAccessCheck />,
			},
			{
				path: "account",
				element: <Account />,
				children: [
					{
						path: "details",
						element: (
							<>
								<UserNameUpdate />
								<PasswordUpdateForm />
							</>
						),
					},
					{
						path: "notifications",
						element: <Notifications />,
					},
				],
			},
		],
	},
]);

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Layout>
						<RouterProvider router={router} />
					</Layout>
				</AuthProvider>
				<Toaster
					toastOptions={{
						success: {
							iconTheme: {
								primary: "#3530d1",
								secondary: "#fff",
							},
						},
						error: {
							iconTheme: {
								primary: "#D24545",
								secondary: "#fff",
							},
						},
					}}
				/>
			</QueryClientProvider>
		</>
	);
}
export default App;

/**
 * TODO:
 *
 * Share -> anyone with the link
 * Save button
 * Download button
 */
