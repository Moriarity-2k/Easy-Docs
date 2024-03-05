import { useEffect, useState } from "react";
import SearchResultsIndividual from "./SearchResultIndividual";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";

export default function SearchResultsWindow({ id }: { id: string }) {
	const [x, setX] = useState<string>("");
	const [values, setValues] = useState<{ name: string }[]>([]);

	useEffect(() => {
		if (x === "") return;
        console.log({x})
		const timer = setTimeout(async () => {
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

			console.log(username_search_results.data.users);
			setValues(username_search_results.data.users);
		}, 1000);

		return () => clearTimeout(timer);
	}, [x, id]);
	return (
		<div className="p-8">
			<div className="space-y-2">
				<Label htmlFor="username text-dark100_light900 base-bold">
					Enter the username
				</Label>
				<Input
					type="text"
					id="username"
					placeholder="keep typing the username"
					className="no-focus text-light400_light500"
					value={x}
					onChange={(e) => setX(e.target.value.trim())}
				/>
			</div>
			<div className="mt-4">
				{values.length > 0 ? (
                    // note: this is for granting requests
					<SearchResultsIndividual names={values} docId={id} />
				) : (
					<div className="bg-slate-100 p-4 text-text-dark200_light900 body-medium">
						Sorry , no users found .
					</div>
				)}
			</div>
		</div>
	);
}
