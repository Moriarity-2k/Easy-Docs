// import { GetBearerToken } from "@/v2/lib/helpers";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { base_url } from "@/constants";
import { useLayoutEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import Lottie from "lottie-react";
import Anime from "../assets/anime1.json";
import { useNavigate } from "react-router-dom";
import { GetBearerToken } from "../../lib/helpers";

interface IAdminDocs {
	id: string;
	title: string;
	createdOn: Date;
	isPublic: boolean;
	slug: string;
	shared?: boolean;
}

interface ISharedDocs {
	id: string;
	title: string;
	createdOn: Date;
	slug: string;
	shared: boolean;
}

export default function AllDocuments() {

	const {
		data: docsData,
		// error,
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

			const x: {
				adminDocs: IAdminDocs[];
				sharedDocs: ISharedDocs[];
			} = {
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

	const [width, setWidth] = useState<number>(window.innerWidth);

	useLayoutEffect(() => {
		function HandleResize(e: Event) {
			setWidth((e.target as Window).outerWidth);
		}

		window.addEventListener("resize", HandleResize);
		return () => window.removeEventListener("resize", HandleResize);
	}, []);

	const [selectFilterOwned, setSelectFilterOwned] = useState<string>("all");

	if (isLoading) {
		return <DocumentPlaceholder showText={false} />;
	}

	// TODO:
	// if(error) {}

	return (
		<div className="w-full flex justify-center items-center font-medium text-gray-700 p-4">
			<div className="w-full max-w-4xl space-y-4">
				{docsData?.adminDocs.length === 0 &&
				docsData.sharedDocs.length === 0 ? (
					<DocumentPlaceholder showText={true} />
				) : (
					<Select
						defaultValue="all"
						value={selectFilterOwned}
						onValueChange={(value) => {
							//  changing the default filter value
							setSelectFilterOwned(value);
						}}
					>
						<SelectTrigger
							className="w-[180px] max-sm:w-max
                        focus:outline-none focus:border-none active:outline-no ne focus:ring-0 max-sm:font-extralight max-sm:text-xs"
						>
							<SelectValue></SelectValue>
						</SelectTrigger>
						<SelectContent className="focus:outline-none max-sm:font-extralight max-sm:text-xs">
							<SelectItem value="all">Owned by anyone</SelectItem>
							<SelectItem value="me">Owned by me</SelectItem>
							<SelectItem value="shared">
								Shared with me
							</SelectItem>
						</SelectContent>
					</Select>
				)}

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
					{selectFilterOwned === "all" &&
						docsData != null &&
						[...docsData.adminDocs, ...docsData.sharedDocs]
							.sort(
								(
									a: IAdminDocs | ISharedDocs,
									b: IAdminDocs | ISharedDocs
								) => {
									return (
										new Date(b.createdOn).getTime() -
										new Date(a.createdOn).getTime()
									);
								}
							)
							.map((doc, index) => {
								return (
									<DocumentCard
										key={index}
										doc={doc}
										name={Name(doc.title, width)}
									/>
								);
							})}
					{selectFilterOwned === "shared" &&
						docsData != null &&
						[...docsData.sharedDocs]
							.sort(
								(
									a: IAdminDocs | ISharedDocs,
									b: IAdminDocs | ISharedDocs
								) => {
									return (
										new Date(b.createdOn).getTime() -
										new Date(a.createdOn).getTime()
									);
								}
							)
							.map((doc, index) => {
								return (
									<DocumentCard
										key={index}
										doc={doc}
										name={Name(doc.title, width)}
									/>
								);
							})}
					{selectFilterOwned === "me" &&
						docsData != null &&
						[...docsData.adminDocs]
							.sort(
								(
									a: IAdminDocs | ISharedDocs,
									b: IAdminDocs | ISharedDocs
								) => {
									return (
										new Date(b.createdOn).getTime() -
										new Date(a.createdOn).getTime()
									);
								}
							)
							.map((doc, index) => {
								return (
									<DocumentCard
										key={index}
										doc={doc}
										name={Name(doc.title, width)}
									/>
								);
							})}
				</div>
			</div>
		</div>
	);
}

export function DocumentPlaceholder({
	showText,
}: {
	showText: boolean;
}) {
	return (
		<div className=" mt-8">
			<Lottie
				animationData={Anime}
				loop={true}
				style={{
					height: 300,
				}}
			/>

			{showText && (
				<div className="text-center mt-8 ">
					Click on create new document to get started !!!
				</div>
			)}
		</div>
	);
}

export function Name(name: string, width: number): string {
	// const width = window.innerWidth;

	if (width <= 700) {
		if (name.length <= 9) return name;
		return `${name.slice(0, 9)} ...`;
	}

	if (width <= 900) {
		if (name.length <= 15) return name;

		return `${name.slice(0, 15)} ...`;
	}
	if (width <= 1200) {
		if (name.length <= 18) return name;
		return `${name.slice(0, 18)} ...`;
	}
	if (name.length <= 25) return name;
	return `${name.slice(0, 25)} ...`;
}

export const DocumentCard = ({
	doc,
	name,
}: {
	doc: IAdminDocs | ISharedDocs;
	name: string;
}) => {
	const navigate = useNavigate();

	return (
		<div
			onClick={() => {
				navigate(
					`/document/${doc.slug}?id=${doc.id}&title=${doc.title}`
				);
			}}
			key={doc.id}
			className="text-left cursor-pointer"
		>
			<div className="h-80 w-full border flex flex-col justify-between hover:border-blue-500 rounded">
				<div className="w-full h-full p-4 flex flex-col space-y-2">
					{skeleton}
				</div>
				<div className="w-full h-24 border-t p-3">
					<h6 className="text-sm max-w-full truncate">{name}</h6>
					<div className="flex items-center justify-between">
						<div className="relative flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-white relative right-2"
								fill="#3b82f6"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="1"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<p className="text-xs text-gray-400 relative right-2">
								{new Date(doc.createdOn).toLocaleDateString(
									"en-US",
									{
										month: "short",
										day: "numeric",
										year: "numeric",
									}
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const skeleton = (
	<>
		{Array.from({ length: 18 }, (x, i) => i).map((i) => {
			return (
				<div
					key={i}
					style={{
						width: `${Math.floor(Math.random() * 100)}%`,
					}}
					className="h-1 bg-gray-200"
				></div>
			);
		})}
	</>
);
