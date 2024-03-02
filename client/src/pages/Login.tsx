import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_VALUES,  formSchemaLogin } from "@/constants";
import toast from "react-hot-toast";
import { ClipSpinner } from "@/components/Spinner";
import FormElement from "@/components/FormElement";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { FaArrowLeft } from "react-icons/fa";

export default function Register() {
	const navigate = useNavigate();
	const { onSubmitLogin } = useAuth();

	const form = useForm<z.infer<typeof formSchemaLogin>>({
		resolver: zodResolver(formSchemaLogin),
		defaultValues: {
			email: "email@gmail.com",
			password: "pass1234",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: onSubmitLogin,
		onError: (err) => {
			toast.error(`Unable to signin. ${err.message}`);
		},
		onSuccess: () => {
			navigate("/");
			toast.success("Sign in successfull !!!");
		},
	});

	return (
		<div className="flex-center h-screen">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchemaLogin>) =>
							mutate(values)
					)}
					className="space-y-4 border light-border-2 xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] background-light800_dark400 shadow-light-300 dark:shadow-none"
				>
					<div className="text-center uppercase h2-bold tracking-wider text-docs-blue dark:text-light-400">
						Sign In
					</div>
					{LOGIN_VALUES.map((field, i) => (
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
							"sign in"
						)}
					</Button>
					<div className="space-y-4">
						<div className="small-regular mt-8 text-light400_light500">
							Don't have an account ? Register here !
						</div>
						<Button
							type="button"
							onClick={() => navigate("/register")}
							className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
						>
							sign up
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-dark400_light500 small-semibold opacity-60 lowercase">
							Back
						</div>
						<Button
							type="button"
							onClick={() => navigate("/")}
							className="bg-light-400 hover:bg-light-500 w-max body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
						>
							<FaArrowLeft />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
