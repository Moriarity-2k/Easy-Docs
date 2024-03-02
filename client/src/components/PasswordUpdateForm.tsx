import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import FormElement from "@/components/FormElement";
import { ClipSpinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchemaUpdatePassword } from "@/constants";

export default function PasswordUpdateForm({
	onSubmitPasswordChange,
}: {
	onSubmitPasswordChange: (
		values: z.infer<typeof formSchemaUpdatePassword>
	) => any;
}) {
	const { mutate, isPending } = useMutation({
		mutationKey: ["password"],
		mutationFn: onSubmitPasswordChange,
		onError: (err) => {
			toast.error(`sorry unable to process. ${err.message}`);
		},
		onSuccess: () => {
			toast.success("password updated successfull !!!");
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
					className="space-y-4 border light-border-2 xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] background-light800_dark400 shadow-light-300 dark:shadow-none"
				>
					<div className="text-center uppercase h2-bold tracking-wider text-docs-blue dark:text-light-400">
						Update Password
					</div>

					<FormElement
						key="password"
						fieldName="password"
						placeHoldText="Enter your old password"
						form={form}
					/>

					<FormElement
						key="new password"
						fieldName="new password"
						placeHoldText="Enter your new password"
						form={form}
					/>

					<FormElement
						key="confirm password"
						fieldName="confirm password"
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
