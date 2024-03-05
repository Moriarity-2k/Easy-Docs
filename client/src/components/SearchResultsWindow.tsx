import { useEffect, useState } from "react";
import SearchResultsIndividual from "./SearchResultIndividual";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipSpinner } from "./Spinner";

export default function SearchResultsWindow({ id }: { id: string }) {
	const [x, setX] = useState<string>("");
	const [values, setValues] = useState<{ name: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (x.trim() === "") return;
		console.log({ x });
        setLoading(true);
		const timer = setTimeout(async () => {
			try {
				const username_search_results = await axios(
					`http://localhost:3000/api/v1/gdocs/user/querysearch?username=${x}&docId=${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				);

				// console.log(username_search_results.data.users);
				setValues(username_search_results.data.users);
			} catch (err) {
				toast.error(
					"Error in fetching results . Please try after some time"
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
						<SearchResultsIndividual names={values} docId={id} />
					) : (
						<div className="bg-slate-100 p-4 text-text-dark200_light900 body-medium">
							Sorry , no users found .
						</div>
					))}
			</div>
		</div>
	);
}
