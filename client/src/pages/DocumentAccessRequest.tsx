import { SpiralSpinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { base_url } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DocumentAccessRequest() {
	const { isLoading, data, isError, error , refetch } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const noti = await axios(`${base_url}/user/notifications`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});
			// console.log(noti.data.notifications);
			return noti.data.notifications;
		},
	});
	const navigate = useNavigate();
	if (isError) {
		toast.error(`${error.message} , please try again later`);
		navigate("/");
	}

	if (isLoading) {
		return <SpiralSpinner sz={90} color="#1a73e8" />;
	}

	return (
		<div className="lg:w-[80%] mx-auto custom-scrollbar max-lg:w-[95%] space-y-6 mt-12">
			<div className="h3-semibold text-dark100_light900">
				Users Requesting Permissions
			</div>
			<ul className="flex flex-wrap">
				{data.map((eachRequest: any, i: number) => {
					return (
						<div
							className="space-y-4 py-4 px-16 border light-border-2 w-max"
							key={i}
						>
							<div className="text-dark300_light900">
								File : {eachRequest.title}
							</div>
							<div className="body-medium text-light400_light500">Requested By : {eachRequest.username}</div>
							<Button
								type="button"
								onClick={async () => {
									try {
										const x = await axios(
											`${base_url}/document/grantPermission`,
											{
												method: "POST",
												headers: {
													"Content-Type":
														"application/json",
												},
												data: {
													docId: eachRequest.id,
													email: eachRequest.email,
												},
												withCredentials: true,
											}
										);
										toast.success(x.data.message);
                                        refetch();
									} catch (err: any) {
										toast.error(err.response.data.message);
									}
								}}
								className="bg-docs-blue hover:bg-docs-blue-hover w-max py-2 px-4  body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
							>
								Grant Permission
							</Button>
						</div>
					);
				})}
			</ul>
		</div>
	);
}
