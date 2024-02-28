import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";

import Modal from "./Modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { base_url } from "@/constants";
import Spinner from "@/components/Spinner";
import FormElement from "@/components/FormElement";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ModalCreateDocument() {
	return (
		<Modal>
			<Modal.Open name="create-document">
				<button>create document</button>
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
		},
		data: {
			title: values.title,
			public: values.public === "public",
		},
	});
	console.log(created_document);
	return created_document;

	// 	console.log(values);
	//
	// 	return new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			resolve({ success: "from the frontend promise" });
	// 		}, 5000);
	// 	});
}

function CreateDocument() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "document_test_1",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["create-document"],
		mutationFn: onSubmit,
		onError: () => {
			toast.error(
				`Failed to create the file. Please Try again Later !!!`
			);
		},
		onSuccess: (data) => {
			toast.success("File creation successfull !!!");
			const doc_data = data.data.file;
			navigate(
				`/document/${doc_data.slug}?id=${doc_data.id}&title=${doc_data.title}`
			);
			// navigate(`/document/${data.data}`);
		},
	});

	return (
		<div className="">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						(values: z.infer<typeof formSchema>) => mutate(values)
					)}
					className="space-y-4 background-light800_dark400"
				>
					<div className="text-center uppercase lg:h2-bold tracking-wider text-docs-blue dark:text-light-400 md:base-bold">
						Create a New Document
					</div>
					<FormElement
						fieldName="title"
						placeHoldText="please enter the title"
						form={form}
					/>

					<FormField
						control={form.control}
						name="public"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel className="text-dark500_light700 tracking-wider capitalize">
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
					>
						{isPending ? (
							<Spinner sz={16} color="bg-primary-500" />
						) : (
							"create document"
						)}
					</Button>
					<div className="space-y-4">
						<div className="small-regular mt-8 flex-[50%] text-light400_light500">
							Check out :
						</div>
						<Button
							type="button"
							className="bg-docs-blue hover:bg-docs-blue-hover w-full body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
							onClick={() => navigate("/")}
						>
							Existing Documents
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
