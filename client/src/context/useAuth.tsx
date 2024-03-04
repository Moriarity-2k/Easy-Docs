import {
	ILoggedUser,
	base_url,
	formSchemaLogin,
	formSchemaRegister,
	formSchemaUpdatePassword,
	formSchemaUpdateUserName,
} from "@/constants";
import { GetBearerToken, SetBearerToken } from "@/lib/helpers";
import axios from "axios";
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export interface IAuthContext {
	onSubmitLogin: (values: z.infer<typeof formSchemaLogin>) => any;
	onSubmitRegister: (values: z.infer<typeof formSchemaRegister>) => any;
	onSubmitUserNameChange: (
		values: z.infer<typeof formSchemaUpdateUserName>
	) => any;
	onSubmitPasswordChange: (
		values: z.infer<typeof formSchemaUpdatePassword>
	) => any;
	loggedInUser: ILoggedUser | any;
	Logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
	const [loggedInUser, setLoggedInUser] = useState<ILoggedUser | any>({});

	async function Logout() {
		try {
			await axios(`${base_url}/logout`, {
				method: "POST",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: GetBearerToken(),
				},
			});

			localStorage.removeItem("user-details");
			setLoggedInUser({});
			SetBearerToken("");
			window.location.replace("/");

			toast.success("user logged out.");
		} catch (err) {
			toast.error(`Sorry , unable to process the request.`);
		}
	}

	async function onSubmitUserNameChange(
		values: z.infer<typeof formSchemaUpdateUserName>
	) {
		const userName = await axios(`${base_url}/user/updateUserName`, {
			method: "POST",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				Authorization: GetBearerToken(),
			},
			data: {
				name: values.username,
			},
		});

		const new_details = {
			name: values.username,
			email: loggedInUser.email,
		};

		localStorage.setItem("user-details", JSON.stringify(new_details));
		setLoggedInUser(new_details);
		return userName;
	}

	async function onSubmitPasswordChange(
		values: z.infer<typeof formSchemaUpdatePassword>
	) {
		await axios(`${base_url}/user/updatePassword`, {
			method: "POST",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				Authorization: GetBearerToken(),
			},
			data: {
				password: values.password,
				new_pass: values["new password"],
			},
		});

		return "";
	}

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
		SetBearerToken(logInUser.data.token);
		return logInUser;
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
		SetBearerToken(created_user.data.token);
		return created_user;
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
			value={{
				onSubmitLogin,
				onSubmitRegister,
				loggedInUser,
				Logout,
				onSubmitUserNameChange,
				onSubmitPasswordChange,
			}}
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
