import { z } from "zod";

const base = import.meta.env.VITE_BACKEND_URL
// const base = "http://localhost:3000/";
export const base_url = `${base}api/v1/gdocs`;
export const socket_url = `${base}`;

export const REGISTER_VALUES = [
	{
		field: "username",
		placeholder: "Please Enter your name",
		type: "text",
		route: `${base_url}/user/search?name=`,
	},
	{ field: "email", placeholder: "Pleae Enter your email", type: "email" },
	{
		field: "password",
		placeholder: "Please Enter you password",
		type: "password",
	},
];
export const LOGIN_VALUES = [
	{ field: "email", placeholder: "Pleae Enter your email", type: "email" },
	{
		field: "password",
		placeholder: "Please Enter you password",
		type: "password",
	},
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
	name?: string;
	email?: string;
}

export interface IEditorDisable {
	access: boolean;
	message: string;
	isAdmin: boolean;
}

export const CATEGORIES = [
	"Recent",
	"Shared with me",
	"Favorite",
	"All documents",
];

export const recentDays = 7 * 24 * 60 * 60 * 1000;

export const formSchemaUpdateUserName = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
});

export const formSchemaUpdatePassword = z.object({
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),

	"new password": z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),
	"confirm password": z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),
});

export function formatDate(timestamp: string): string {
	const date = new Date(timestamp);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
}
