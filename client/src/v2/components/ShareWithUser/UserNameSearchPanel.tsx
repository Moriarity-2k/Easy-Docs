import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipSpinner } from "../Spinner";
import { base_url } from "@/constants";
// import { GetBearerToken } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserSearchResults from "./UserSearchResults";
import { GetBearerToken } from "@/v2/lib/helpers";

export default function UserNameSearchPanel({ id }: { id: string }) {
	const [x, setX] = useState<string>("");
	const [values, setValues] = useState<{ name: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (x.trim() === "") return;
		// console.log({ x, id });
		setLoading(true);
		const timer = setTimeout(async () => {
			try {
				const username_search_results = await axios(
					`${base_url}/user/querysearch?username=${x}&docId=${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: GetBearerToken(),
						},
						withCredentials: true,
					}
				);

				// console.log(username_search_results.data.users);
				setValues(username_search_results.data.users);
			} catch (err) {
				// toast.error(
				// 	"Error in fetching results . Please try after some time"
				// );
				toast(
					<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
						<div className="font-mono text-red-600">Error</div>
						<div className="">
							Error in fetching results . Please try after some
							time
						</div>
					</div>
				);
			} finally {
				setLoading(false);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [x, id]);

	return (
		<div className="p-8">
			<div className="space-y-2">
				<Label
					htmlFor="username"
					className="text-dark100_light900 base-bold"
				>
					Enter the username
				</Label>
				<Input
					type="text"
					id="username"
					placeholder="keep typing the username"
					className="no-focus text-light400_light500"
					value={x}
					autoComplete="false"
					onChange={(e) => setX(e.target.value)}
				/>
			</div>
			<div className="mt-4">
				{x !== "" &&
					(loading ? (
						<ClipSpinner sz={16} color="bg-primary-500" />
					) : values.length > 0 ? (
						// note: this is for granting requests
						<UserSearchResults names={values} docId={id} />
					) : (
						<div className="bg-slate-100 p-4 text-text-dark200_light900 body-medium">
							Sorry , no users found .
						</div>
					))}
			</div>
		</div>
	);
}
