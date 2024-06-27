import { useEffect, useState } from "react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { GetBearerToken } from "../lib/helpers";

export default function FormElementInput({
	fieldName,
	placeHoldText,
	form,
	DisableButtonHandler,
	type,
	route,
}: {
	fieldName: string;
	placeHoldText: string;
	form: any;
	type?: string;
	DisableButtonHandler?: (val: boolean) => void;
	route?: string;
}) {
	const [name, setName] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!route || name == "" || route === "") return;

		const timer = setTimeout(() => {
			SearchNames();
		}, 1000);
		async function SearchNames() {
			try {
				setLoading(true);
				setError(null);
				const x = await axios(`${route}${name}`, {
					method: "GET",
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						Authorization: GetBearerToken(),
					},
				});

				if (!x.data.ok) {
					if (DisableButtonHandler) DisableButtonHandler(true);
					// toast.error("Document name already exists !!! 💥");
					setError("Name is already taken");
				} else {
					if (DisableButtonHandler) DisableButtonHandler(false);
				}
			} catch (err) {
				// TODO: handle this -> Handled
				// console.log(err);
				toast(
					<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
						<div className="font-mono text-red-600">Error</div>
						<div className="">Something went wrong</div>
					</div>
				);
			} finally {
				setLoading(false);
			}
		}

		return () => {
			clearTimeout(timer);
		};
	}, [name]);

	return (
		<FormField
			control={form.control}
			name={fieldName}
			render={({ field }) => (
				<FormItem className="text-dark100_light900">
					<FormLabel
						className="text-dark500_light700 tracking-wider capitalize text-docs-blue"
						style={{}}
					>
						<span>{fieldName}</span>
						{loading && (
							<ClipLoader
								color="black"
								size={15}
								className="ml-2"
							/>
						)}
					</FormLabel>
					<FormControl>
						<div className="">
							<div className="flex items-center">
								<Input
									className=" text-dark400_light500 tracking-wide small-medium no-focus placeholder:text-light400_dark500"
									placeholder={placeHoldText}
									{...field}
									value={name}
									onChangeCapture={(e) => {
										setName(e.currentTarget.value);
										console.log(e.currentTarget.value);
									}}
									type={type ? type : "text"}
								/>
							</div>
							{error != null && (
								<div className="text-red-600 text-[11px] mt-2">
									{error}
								</div>
							)}
						</div>
					</FormControl>
					<FormMessage className="text-red-600 dark:text-red-600" />
				</FormItem>
			)}
		/>
	);
}
