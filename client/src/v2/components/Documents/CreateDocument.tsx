import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { base_url } from "@/constants";
import { GetBearerToken } from "@/v2/lib/helpers";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import FormElementInput from "../FormElementInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipSpinner } from "../Spinner";

export default function ModalCreateDocument() {
	return (
		<Modal>
			<Modal.Open name="create-document">
				<Button
					type="button"
					className="bg-docs-blue hover:bg-docs-blue-hover w-max px-4 py-2 body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
				>
					New File
				</Button>
			</Modal.Open>

			<Modal.Window name="create-document">
				<CreateDocument />
			</Modal.Window>
		</Modal>
	);
}

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	public: z.enum(["public", "private"], {
		required_error: "You need to select a notification type.",
	}),
});

async function onSubmit(values: z.infer<typeof formSchema>) {
	const created_document = await axios(`${base_url}/createNewDocument`, {
		method: "POST",
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
			Authorization: GetBearerToken(),
		},
		data: {
			title: values.title,
			public: values.public === "public",
		},
	});
	// console.log(created_document);
	return created_document;
}

export function CreateDocument() {
	const navigate = useNavigate();

	const [btnDisable, setBtnDisable] = useState<boolean>(true);

	function DisableButtonHandler(val: boolean) {
		if (val === btnDisable) return;
		setBtnDisable(val);
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			// title: "document_test_1",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["create-document"],
		mutationFn: onSubmit,
		onError: () => {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Something went wrong . Try again later !!!
					</div>
				</div>
			);
		},
		onSuccess: (data) => {
			// toast.success("File creation successfull !!!");
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">
						Success 🎉🎉 !!!
					</div>
					<div className="">Document created successfully 🎉🎉</div>
				</div>
			);
			const doc_data = data.data.file;
			navigate(
				`/document/${doc_data.slug}?id=${doc_data.id}&title=${doc_data.title}`
			);
		},
	});

	return (
		<div className="text-dark100_light900" style={{}}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchema>) => mutate(values)
					)}
					className="space-y-4 background-light800_dark400"
				>
					<div className="text-center uppercase lg:h2-bold tracking-wider text-docs-blue dark:text-light-400 md:base-bold josefin-slab-bold">
						Create a New Document
					</div>
					<FormElementInput
						fieldName="title"
						placeHoldText="please enter the title"
						form={form}
						type="text"
						route={`${base_url}/document/search?title=`}
						DisableButtonHandler={DisableButtonHandler}
					/>

					<FormField
						control={form.control}
						name="public"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel className="text-dark500_light700 tracking-wider capitalize text-docs-blue">
									Visibility
								</FormLabel>
								<FormControl className="">
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem
													className="no-focus"
													value="public"
												/>
											</FormControl>
											<FormLabel className="font-normal">
												public
											</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="private" />
											</FormControl>
											<FormLabel className="font-normal">
												private
											</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest"
						disabled={btnDisable}
					>
						{isPending ? (
							<ClipSpinner sz={16} color="bg-primary-500" />
						) : (
							"create document"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
