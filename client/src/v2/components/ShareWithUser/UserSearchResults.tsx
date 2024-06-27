import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { ClipSpinner } from "./Spinner";
import axios from "axios";
import { base_url } from "@/constants";
// import { GetBearerToken } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { ClipSpinner } from "../Spinner";
import { GetBearerToken } from "@/v2/lib/helpers";

export default function UserSearchResults({
	names,
	docId,
}: {
	names: { name: string }[];
	docId: string;
}) {
	return (
		<ul className="background-light800_dark300 text-dark300_light700 body-regular py-2 space-y-3">
			{names.map((name, i) => {
				return (
					<div
						className="flex bg-slate-200 justify-between p-2 items-center "
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
					Authorization: GetBearerToken(),
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
			// toast.success("Document shared successfully");
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Success 🎉🎉</div>
					<div className="">
						Document Shared successfully with {name}
					</div>
				</div>
			);
		},
		onError: () => {
			// toast.error("Something went wrong. Please try again later");
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Something went wrong. Please try again later
					</div>
				</div>
			);
		},
	});
	// if (isSuccess) {
	// 	return;
	// }
	return (
		<>
			{/* ONClick should but the current docId and access into the userId */}
			{!isSuccess ? (
				<Button
					type="button"
					onClick={() => mutate(name)}
					className="bg-docs-blue hover:bg-docs-blue-hover w-[11rem] py-2 px-4  body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold max-sm:small-regular"
				>
					{isPending ? (
						<ClipSpinner sz={16} color="bg-primary-500" />
					) : (
						"Share with"
					)}
				</Button>
			) : (
				<div className="w-[11rem] py-2 px-4  body-semibold text-black  tracking-widest subtle-semibold max-sm:small-regular bg-inherit hover:bg-inherit pointer-events-none ">
					Shared with
				</div>
			)}

			<li
				className="py-2 px-4 mx-4 text-[#2c2c2c] font-bold max-sm:small-regular"
				key={i}
			>
				{name}
			</li>
		</>
	);
}
