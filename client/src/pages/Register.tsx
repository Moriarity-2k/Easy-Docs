import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "axios";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_VALUES, base_url } from "@/constants";
import toast from "react-hot-toast";
import {ClipSpinner} from "@/components/Spinner";
import FormElement from "@/components/FormElement";
import { useNavigate } from "react-router-dom";

export const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	email: z.string().email({ message: "Please provide a valid email" }),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 characters." }),
});

async function onSubmit(values: z.infer<typeof formSchema>) {
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
	return created_user;

	// 	console.log(values);
	//
	// 	return new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			resolve({ success: "from the frontend promise" });
	// 		}, 5000);
	// 	});
}

export default function Register() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "username",
			email: "email@gmail.com",
			password: "pass1234",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["register"],
		mutationFn: onSubmit,
		onError: (err) => {
			toast.error(`unable to create account. ${err.message}`);
		},
		onSuccess: () => {
			toast.success("Account successfully created !!!");
			navigate("/");
		},
	});

	return (
		<div className="h-screen flex-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchema>) => mutate(values)
					)}
					className="space-y-4 border-2 light-border xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] background-light800_dark400"
				>
					<div className="text-center uppercase h2-bold tracking-wider text-docs-blue dark:text-light-400">
						Sign Up
					</div>
					{REGISTER_VALUES.map((field, i) => (
						<FormElement
							key={i}
							fieldName={field.field}
							placeHoldText={field.placeholder}
							form={form}
						/>
					))}

					<Button
						type="submit"
						className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest"
					>
						{isPending ? (
							<ClipSpinner sz={16} color="bg-primary-500" />
						) : (
							"sign up"
						)}
					</Button>
					<div className="space-y-4">
						<div className="small-regular mt-8 text-light400_light500">
							Already have an account ?{" "}
						</div>
						<Button
							type="button"
							className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
							onClick={() => navigate("/login")}
						>
							Login
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
