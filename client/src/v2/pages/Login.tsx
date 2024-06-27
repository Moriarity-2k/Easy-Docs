import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_VALUES, formSchemaLogin } from "@/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { FaArrowLeft } from "react-icons/fa";
import { ClipSpinner } from "../components/Spinner";
import FormElementInput from "../components/FormElementInput";

export default function Login() {
	const navigate = useNavigate();
	const { onSubmitLogin } = useAuth();

	const form = useForm<z.infer<typeof formSchemaLogin>>({
		resolver: zodResolver(formSchemaLogin),
		defaultValues: {
			email: "user@gmail.com",
			password: "pass1234",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: onSubmitLogin,
		onError: () => {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">Invalid email or password</div>
				</div>
			);
		},
		onSuccess: () => {
			navigate("/");
			// toast.success("You have successfully logged in !!!");
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">
						Welcome 🎉🎉 !!!
					</div>
					<div className="">You have successfully logged in</div>
				</div>
			);
		},
	});

	return (
		<div
			className="flex-center h-screen exp_gradient"
			style={{
				// backgroundImage: "url('/bg_exp_2.jpeg')",
				// backgroundSize: "cover",
				// backgroundPosition: "center",
				// backgroundRepeat: "no-repeat",
			}}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchemaLogin>) =>
							mutate(values)
					)}
					className="space-y-4 border light-border-2  xl:w-1/3 lg:w-2/3 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] max-sm:h-full background-light800_dark400 z-10"
					style={{
						boxShadow: "8px 8px 8px rgba(0.2, 0.2, 0, 0.2)",
					}}
				>
					<div className="text-center uppercase tracking-widest text-[3rem] text-black josefin-slab-bold shadow-sm">
						EasyDocs
					</div>
					<div className="text-center uppercase h2-bold tracking-wider text-docs-blue dark:text-light-400">
						Sign Up
					</div>
					{LOGIN_VALUES.map((field, i) => (
						<FormElementInput
							key={i}
							type={field.type}
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
