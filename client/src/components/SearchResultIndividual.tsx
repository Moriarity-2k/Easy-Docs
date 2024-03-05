import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipSpinner } from "./Spinner";
import { Button } from "./ui/button";
import axios from "axios";
import { base_url } from "@/constants";

export default function SearchResultsIndividual({
	names,
	docId,
}: {
	names: { name: string }[];
	docId: string;
}) {
	return (
		<ul className="background-light800_dark300 text-dark300_light700 body-regular divide-y-2 py-2">
			{names.map((name, i) => {
				return (
					<div
						className="flex justify-between p-2 items-center "
						key={i}
					>
						<EachFoundUser name={name.name} i={i} docId={docId} />
					</div>
				);
			})}
		</ul>
	);
}

function EachFoundUser({
	name,
	i,
	docId,
}: {
	name: string;
	i: number;
	docId: string;
}) {
	const { isPending, mutate, isSuccess } = useMutation({
		mutationKey: ["grant-access"],
		mutationFn: async (name: string) => {
			const x = await axios(`${base_url}/document/grantPermission`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				data: {
					docId: docId,
					username: name,
				},
				withCredentials: true,
			});
			return x.data;
		},
		onSuccess: () => {
			toast.success("Document shared successfully");
		},
		onError: () => {
			toast.error("Something went wrong. Please try again later");
		},
	});
	if (isSuccess) {
		return;
	}
	return (
		<>
			<li
				className="py-2 px-4 mx-4 text-light400_light500 body-regular max-sm:small-regular"
				key={i}
			>
				{name}
			</li>

			{/* ONClick should but the current docId and access into the userId */}
			<Button
				type="button"
				onClick={() => mutate(name)}
				className="bg-docs-blue hover:bg-docs-blue-hover w-[11rem] py-2 px-4  body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold max-sm:small-regular"
			>
				{isPending ? (
					<ClipSpinner sz={16} color="bg-primary-500" />
				) : (
					"Grant Access"
				)}
			</Button>
		</>
	);
}
