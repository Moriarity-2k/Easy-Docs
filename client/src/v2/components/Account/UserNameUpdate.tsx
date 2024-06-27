import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { base_url, formSchemaUpdateUserName } from "@/constants";
import FormElementInput from "../FormElementInput";
import { ClipSpinner } from "../Spinner";
import { useState } from "react";
import { useAuth } from "@/context/useAuth";

export default function UserNameUpdate() {
	const { onSubmitUserNameChange } = useAuth();

	const { mutate, isPending } = useMutation({
		mutationKey: ["username"],
		mutationFn: onSubmitUserNameChange,
		onError: () => {
			<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
				<div className="font-mono text-red-600">Error</div>
				<div className="">Sorry ! Username could not be updated</div>
			</div>;
		},
		onSuccess: () => {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Success 🎉🎉</div>
					<div className="">Username successfully updated</div>
				</div>
			);
		},
	});

	const form = useForm<z.infer<typeof formSchemaUpdateUserName>>({
		resolver: zodResolver(formSchemaUpdateUserName),
		defaultValues: {
			username: "",
		},
	});

	const [disableButton, setDisableButton] = useState<boolean>(false);
	function DisableButtonHandler(val: boolean) {
		setDisableButton(val);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(
					(values: z.infer<typeof formSchemaUpdateUserName>) =>
						mutate(values)
				)}
				className="space-y-4 border light-border-2 max-w-4xl mx-auto p-[2rem] background-light800_dark400 shadow-light-300 dark:shadow-none"
			>
				<div className="text-center capitalize h2-bold tracking-wider text-black dark:text-light-400">
					Update Username
				</div>
				<FormElementInput
					key="username"
					fieldName="username"
					placeHoldText="Enter your new username"
					form={form}
					type="text"
					route={`${base_url}/user/search?name=`}
					DisableButtonHandler={DisableButtonHandler}
				/>

				<Button
					type="submit"
					className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest disabled:bg-dark-400 exp_gradient"
					disabled={disableButton || isPending}
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
