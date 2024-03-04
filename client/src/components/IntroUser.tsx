import { useQuery } from "@tanstack/react-query";
import { SpiralSpinner } from "./Spinner";
import toast from "react-hot-toast";
import axios from "axios";
import { base_url, recentDays } from "@/constants";

export default function IntroUser() {
	const navigate = useNavigate();

	const {
		data: docsData,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["all documents"],
		queryFn: async () => {
			const docs = await axios(`${base_url}/documents/getAllDocuments`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: GetBearerToken(),
				},
				withCredentials: true,
			});
			const x = {
				adminDocs:
					docs.data.docs.adminDocs &&
					docs.data.docs.adminDocs.length > 0
						? docs.data.docs.adminDocs
						: [],
				sharedDocs:
					docs.data.docs.sharedDocs &&
					docs.data.docs.sharedDocs.length > 0
						? docs.data.docs.sharedDocs
						: [],
			};
			return x;
		},
	});

	if (isLoading) {
		return <SpiralSpinner sz={90} color="#1a73e8" />;
	}

	if (error) {
		console.log(error);
		toast.error(`Error on fetching files`);
	}

	return (
		<div className="mx-auto lg:w-[60%] mt-16 space-y-8 md:w-[80%] w-[95%]">
			<div className="space-y-4">
				<div className="mb-2 space-y-4">
					<div className="text-dark200_light900 base-bold tracking-wider">
						Start working on a new file ?
					</div>
					<ModalCreateDocument />
				</div>
				<div className="h2-bold text-light400_light500">Recent</div>
				<ul className="flex gap-4 flex-wrap">
					{docsData && docsData.adminDocs.length > 0 ? (
						docsData.adminDocs
							.slice(0, 6)
							.map((docs: any, i: number) => {
								// console.log(docs);
								if (
									Date.now() - recentDays <
									Date.parse(docs.createdOn)
								) {
									return (
										<EachDisplayDocumnet
											navigate={navigate}
											docs={docs}
											i={i}
											key={i}
										/>
									);
								}
							})
					) : (
						<NoDocsFound />
					)}
				</ul>
			</div>

			<div className="space-y-4">
				<div className="h2-bold text-light400_light500">
					Shared with me
				</div>
				<ul className="flex gap-4 flex-wrap">
					{docsData && docsData.sharedDocs.length > 0 ? (
						docsData.sharedDocs
							.slice(0, 6)
							.map((docs: any, i: number) => {
								console.log(docs);
								if (
									Date.now() - recentDays <
									Date.parse(docs.createdOn)
								) {
									return (
										<EachDisplayDocumnet
											navigate={navigate}
											docs={docs}
											i={i}
											key={i}
										/>
									);
								}
							})
					) : (
						<NoDocsFound />
					)}
				</ul>
			</div>

			{/*
                TODO: 
                <div>
                    <div>Favourites</div>
                </div> 
            */}

			<div className="space-y-4">
				<div className="h2-bold text-light400_light500">
					All Documents
				</div>
				<ul className="flex gap-4 flex-wrap">
					{docsData &&
					[...docsData.adminDocs, ...docsData.sharedDocs].length >
						0 ? (
						[...docsData.adminDocs, ...docsData.sharedDocs].map(
							(docs: any, i: number) => {
								// console.log(docs);
								if (
									Date.now() - recentDays <
									Date.parse(docs.createdOn)
								) {
									return (
										<EachDisplayDocumnet
											navigate={navigate}
											docs={docs}
											i={i}
											key={i}
										/>
									);
								}
							}
						)
					) : (
						<NoDocsFound />
					)}
				</ul>
			</div>
		</div>
	);
}

import { Skeleton } from "@/components/ui/skeleton";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ModalCreateDocument from "./CreateDocument";
import { GetBearerToken } from "@/lib/helpers";

function EachDisplayDocumnet({
	navigate,
	i,
	docs,
}: {
	navigate: NavigateFunction;
	i: number;
	docs: any;
}) {
	return (
		<li
			key={i}
			onClick={() =>
				navigate(
					`/document/${docs.slug}?id=${docs.id}&title=${docs.title}`
				)
			}
			className="space-y-4 hover:cursor-pointer"
		>
			<div className="flex flex-col space-y-3 relative">
				<Skeleton className="h-[155px] w-[120px] bg-slate-300 rounded-sm dark:bg-light-400" />
			</div>
			<p className="text-dark500_light700 small-medium opacity-60">
				{docs.title}
			</p>
		</li>
	);
}

function NoDocsFound() {
	return (
		<div className="p-8 uppercase text-dark400_light500 tracking-wider">
			Sorry , No Documnets yet !!!
		</div>
	);
}
