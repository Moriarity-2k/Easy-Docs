import { Button } from "@/components/ui/button";
import { base_url } from "@/constants";
import { GetBearerToken } from "@/v2/lib/helpers";
import { HourGlassSpinner } from "@/v2/pages/DocumentAccessCheck";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { skeleton } from "../Documents/AllDocuments";
import Anime from "../assets/anime1.json";
import { IoDocumentOutline, IoPersonAddOutline } from "react-icons/io5";
import Lottie from "lottie-react";

export default function Notifications() {
	const { isLoading, data, isError, error, refetch } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const noti = await axios(`${base_url}/user/notifications`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `${GetBearerToken()}`,
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
		return (
			<div className="flex items-center justify-center h-full py-20 w-full bg-opacity-50 backdrop-blur-md">
				<HourGlassSpinner colors={["#306cce", "#72a1ed"]} />
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className=" mt-8">
				<Lottie
					animationData={Anime}
					loop={true}
					style={{
						height: 300,
					}}
				/>

				<div className="text-center mt-8 ">
					No request as of now . You've already caught up with the
					notifications 🎉🎉
				</div>
			</div>
		);
	}

	return (
		<div className=" mx-auto custom-scrollbar space-y-6 mt-12 max-w-4xl">
			<div className="h3-semibold text-dark100_light900">
				Users Requesting Permissions
			</div>
			<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{data &&
					data.map((eachRequest: any, i: number) => {
						return (
							<div
								className="text-left cursor-pointer space-y-4"
								key={i}
							>
								<div className="h-80 w-full border flex flex-col justify-between hover:border-blue-500 rounded">
									<div className="w-full h-full p-4 flex flex-col space-y-2">
										{skeleton}
									</div>
									<div className="w-full h-24 border-t space-y-2">
										<div className="text-sm pl-4 font-semibold max-w-full truncate josefin-slab-bold text-gray-400 mt-3 flex items-center gap-2">
											<IoDocumentOutline className="text-blue-800 fill-slate-500" />
											<span>{eachRequest.title}</span>
										</div>
										<div className="text-slate-400 pl-4 flex items-center gap-2">
											<IoPersonAddOutline className="text-blue-800 fill-slate-500 text-sm" />
											<div className="text-sm text-slate-600">
												{eachRequest.username}
											</div>
										</div>
									</div>
								</div>

								<Button
									type="button"
									onClick={async () => {
										try {
											await axios(
												`${base_url}/document/grantPermission`,
												{
													method: "POST",
													headers: {
														"Content-Type":
															"application/json",
													},
													data: {
														docId: eachRequest.id,
														username:
															eachRequest.username,
													},
													withCredentials: true,
												}
											);
											toast(
												<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
													<div className="font-mono text-green-600">
														Success 🎉🎉
													</div>
													<div className="">
														{eachRequest.username ||
															"user"}{" "}
														has now access to the
														document
													</div>
												</div>
											);
											refetch();
										} catch (err: any) {
											toast(
												// err.response.data.message
												<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
													<div className="font-mono text-red-600">
														Error
													</div>
													<div className="">
														{
															err.response.data
																.message
														}
													</div>
												</div>
											);
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
