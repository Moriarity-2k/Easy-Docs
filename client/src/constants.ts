import { z } from "zod";

const base = "https://easydocs-server.onrender.com/";
// const base = "http://localhost:3000/" 
export const base_url = `${base}api/v1/gdocs`;
export const socket_url = `${base}`;

export const REGISTER_VALUES = [
	{ field: "username", placeholder: "Please Enter your name" },
	{ field: "email", placeholder: "Pleae Enter your email" },
	{ field: "password", placeholder: "" },
];
export const LOGIN_VALUES = [
	{ field: "email", placeholder: "Pleae Enter your email" },
	{ field: "password", placeholder: "Password must be at least 4 characters." },
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

export interface IEditorDisable {
	access: boolean;
	message: string;
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
