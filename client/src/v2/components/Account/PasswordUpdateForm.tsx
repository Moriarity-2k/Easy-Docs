import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchemaUpdatePassword } from "@/constants";
import FormElementInput from "../FormElementInput";
import { ClipSpinner } from "../Spinner";
import { useAuth } from "@/context/useAuth";

export default function PasswordUpdateForm() {
	const { onSubmitPasswordChange } = useAuth();

	const { mutate, isPending } = useMutation({
		mutationKey: ["password"],
		mutationFn: onSubmitPasswordChange,
		onError: () => {
			<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
				<div className="font-mono text-red-600">Error</div>
				<div className="">Sorry ! password could not be updated</div>
			</div>;
		},
		onSuccess: () => {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Success 🎉🎉</div>
					<div className="">Password successfully updated</div>
				</div>
			);
		},
	});

	const form = useForm<z.infer<typeof formSchemaUpdatePassword>>({
		resolver: zodResolver(formSchemaUpdatePassword),
		defaultValues: {
			password: "",
			"new password": "",
			"confirm password": "",
		},
	});

	return (
		<div className="">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchemaUpdatePassword>) =>
							mutate(values)
					)}
					className="space-y-4 border light-border-2 max-w-4xl mx-auto p-[2rem] bg-slate-50 shadow-light-300 dark:shadow-none"
				>
					<div className="text-center capitalize h2-bold tracking-wider text-docs-blue dark:text-light-400">
						Update Password
						<div className="text-xs text-center lowercase font-extralight text-black">
							ensure the password is long and contains random symbols to make
							it strong and secure
						</div>
					</div>

					<FormElementInput
						key="password"
						fieldName="password"
						type="password"
						placeHoldText="Enter your old password"
						form={form}
					/>

					<FormElementInput
						key="new password"
						fieldName="new password"
						type="password"
						placeHoldText="Enter your new password"
						form={form}
					/>

					<FormElementInput
						key="confirm password"
						fieldName="confirm password"
						type="password"
						placeHoldText="Confirm your new password"
						form={form}
					/>

					<Button
						type="submit"
						className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest"
					>
						{isPending ? (
							<ClipSpinner sz={16} color="bg-primary-500" />
						) : (
							"update"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
