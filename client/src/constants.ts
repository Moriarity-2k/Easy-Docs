import { z } from "zod";

export const base_url = "http://localhost:3000/api/v1/gdocs";
export const socket_url = "http://localhost:3000/";

export const REGISTER_VALUES = [
	{ field: "username", placeholder: "enter user name" },
	{ field: "email", placeholder: "name@email.com" },
	{ field: "password", placeholder: "****" },
];
export const LOGIN_VALUES = [
	{ field: "email", placeholder: "name@email.com" },
	{ field: "password", placeholder: "****" },
];

export const formSchemaLogin = z.object({
	email: z.string().email({ message: "Please provide a valid email" }),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),
});

export const formSchemaRegister = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	email: z.string().email({ message: "Please provide a valid email" }),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),
});

export interface ILoggedUser {
	name: string;
	email: string;
}
