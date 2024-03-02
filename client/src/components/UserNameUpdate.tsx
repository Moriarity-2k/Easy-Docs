import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import FormElement from "@/components/FormElement";
import { ClipSpinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchemaUpdateUserName } from "@/constants";

export default function UserNameUpdate({
	onSubmitUserNameChange,
}: {
	onSubmitUserNameChange: (
		values: z.infer<typeof formSchemaUpdateUserName>
	) => any;
}) {
	const { mutate, isPending } = useMutation({
		mutationKey: ["username"],
		mutationFn: onSubmitUserNameChange,
		onError: (err) => {
			toast.error(`sorry unable to process. ${err.message}`);
		},
		onSuccess: () => {
			toast.success("username updated successfull !!!");
		},
	});

	const form = useForm<z.infer<typeof formSchemaUpdateUserName>>({
		resolver: zodResolver(formSchemaUpdateUserName),
		defaultValues: {
			username: "",
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(
					(values: z.infer<typeof formSchemaUpdateUserName>) =>
						mutate(values)
				)}
				className="space-y-4 border light-border-2 xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] background-light800_dark400 shadow-light-300 dark:shadow-none"
			>
				<div className="text-center uppercase h2-bold tracking-wider text-docs-blue dark:text-light-400">
					Update Username
				</div>
				<FormElement
					key="username"
					fieldName="username"
					placeHoldText="Enter the new username"
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
	);
}
