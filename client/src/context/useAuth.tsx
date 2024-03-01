import {
	ILoggedUser,
	base_url,
	formSchemaLogin,
	formSchemaRegister,
} from "@/constants";
import axios from "axios";
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { z } from "zod";

interface IAuthContext {
	onSubmitLogin: (values: z.infer<typeof formSchemaLogin>) => any;
	onSubmitRegister: (values: z.infer<typeof formSchemaRegister>) => any;
	loggedInUser: ILoggedUser | any;
}

const AuthContext = createContext<IAuthContext | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
	const [loggedInUser, setLoggedInUser] = useState<ILoggedUser | any>({});

	async function onSubmitLogin(values: z.infer<typeof formSchemaLogin>) {
		const logInUser = await axios(`${base_url}/login`, {
			method: "POST",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				password: values.password,
				email: values.email,
			},
		});
		localStorage.setItem(
			"user-details",
			JSON.stringify(logInUser.data.user)
		);
		setLoggedInUser(logInUser.data.user);
		return logInUser;

		// console.log(values);
		// return new Promise((resolve) => {
		// 	setTimeout(() => {
		// 		resolve({ success: "from the frontend promise" });
		// 	}, 5000);
		// });
	}

	async function onSubmitRegister(
		values: z.infer<typeof formSchemaRegister>
	) {
		const created_user = await axios(`${base_url}/signup`, {
			method: "POST",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				name: values.username,
				password: values.password,
				email: values.email,
			},
		});
		localStorage.setItem(
			"user-details",
			JSON.stringify(created_user.data.user)
		);
		setLoggedInUser(created_user.data.user);
		return created_user;

		// 	console.log(values);
		//
		// 	return new Promise((resolve) => {
		// 		setTimeout(() => {
		// 			resolve({ success: "from the frontend promise" });
		// 		}, 5000);
		// 	});
	}

	useEffect(() => {
		const user_localstorage = localStorage.getItem("user-details");
		if (user_localstorage && user_localstorage !== null) {
			const parsed_user = JSON.parse(user_localstorage);
			setLoggedInUser(parsed_user);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{ onSubmitLogin, onSubmitRegister, loggedInUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const values = useContext(AuthContext);
	return { ...values };
}

export default AuthProvider;
