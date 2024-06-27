import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_VALUES, formSchemaRegister } from "@/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import FormElementInput from "../components/FormElementInput";
import { useState } from "react";
import { ClipSpinner } from "../components/Spinner";

export default function Register() {
	const navigate = useNavigate();
	const { onSubmitRegister } = useAuth();

	const form = useForm<z.infer<typeof formSchemaRegister>>({
		resolver: zodResolver(formSchemaRegister),
		defaultValues: {
			username: "username",
			email: "email@gmail.com",
			password: "pass1234",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["register"],
		mutationFn: onSubmitRegister,
		onError: (err) => {
			console.log(err);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">Email Id is already registered.</div>
				</div>
			);
		},
		onSuccess: () => {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">
						Welcome Aboard 🎉🎉
					</div>
					<div className="">
						Your account has been created successfully
					</div>
				</div>
			);
			navigate("/");
		},
	});

	const [disableButton, setDisableButton] = useState<boolean>(false);
	function DisableButtonHandler(val: boolean) {
		setDisableButton(val);
	}

	return (
		<div
			className="flex-center h-screen exp_gradient"
			style={
				{
					// backgroundImage: "url('/bg_exp_2.jpeg')",
					// backgroundSize: "cover",
					// backgroundPosition: "center",
					// backgroundRepeat: "no-repeat",
				}
			}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchemaRegister>) =>
							mutate(values)
					)}
					className="space-y-4 border light-border-2  xl:w-1/3 lg:w-2/3 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] max-sm:h-full background-light800_dark400 z-10 animate-width"
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
					{REGISTER_VALUES.map((field, i) => (
						<>
							<FormElementInput
								key={i}
								type={field.type}
								fieldName={field.field}
								placeHoldText={field.placeholder}
								form={form}
								route={field.route ? field.route : ""}
                                DisableButtonHandler={DisableButtonHandler}
							/>
						</>
					))}

					<Button
						type="submit"
						className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest"
						disabled={disableButton}
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
