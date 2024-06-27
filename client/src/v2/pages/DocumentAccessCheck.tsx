import { IEditorDisable, base_url } from "@/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetBearerToken } from "../lib/helpers";

export default function DocumentAccessCheck() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [editorDisable, setEditorDisable] = useState<IEditorDisable>({
		access: true,
		message: "loading",
		isAdmin: false,
	});

	const title = searchParams.get("title")!;

	const id = searchParams.get("id")!;

	useEffect(() => {
		async function getAccess() {
			try {
				const x = await axios(`${base_url}/document/getAccess/${id}`, {
					method: "GET",
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						Authorization: GetBearerToken(),
					},
				});

				// No Access to the document -> Ask Access Page
				if (x.data.message === 10) {
					setEditorDisable({
						access: false,
						message: "No Access",
						isAdmin: false,
					});
					toast.error("You do not have access to this document");
				}

				/**
				 * Document is deleted or something
				 * so notify and get back to all documents
				 */
				if (x.data.message === 11) {
					navigate("/");
					toast.error("Document doesn't exist");
				}

				// I am the admin or have access to read/write
				if (x.data.message === 0 || x.data.message === 1) {
					setEditorDisable({
						access: true,
						message: "ok",
						isAdmin: x.data.message === 0,
					});
				}

				// Can only view the doc
				if (x.data.message === 2) {
					setEditorDisable({
						access: true,
						message: "view",
						isAdmin: false,
					});
				}
			} catch (err) {
				navigate("/");
				toast.error("Unable to connect to server");
				setEditorDisable({
					isAdmin: false,
					access: false,
					message: "No Access",
				});
			}
		}

		getAccess();
	}, [id, navigate]);

	if (editorDisable.message === "loading") {
		return (
			<div className="flex items-center justify-center h-screen w-full exp_gradient bg-opacity-50 backdrop-blur-md">
				<HourGlassSpinner />
			</div>
		);
	}

	if (editorDisable.access === true) {
		return (
			<TinyEditor
				docId={id}
				title={title}
				editorDisable={editorDisable}
			/>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between w-full sticky top-0 p-4 max-sm:p-2 shadow-sm z-50 bg-white ">
				<div
					className="flex items-center gap-2 md:gap-4 cursor-pointer"
					onClick={() => navigate("/")}
				>
					<img src={DocsIcon} width={50} height={50} />
					<div className="font-mono max-sm:hidden text-lg font-semibold text-[#000000b7]">
						EasyDocs
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className=" josefin-slab-bold capitalize">
						{Name(title || "Empty Document", 800)}
					</div>
					<div>
						<AccountMenu />
					</div>
				</div>
			</div>
			<div className="flex-grow">
				<AskAccess id={id} />
			</div>
		</div>
	);
}

import DocsIcon from "../components/icons/Docs.svg";
import { Hourglass } from "react-loader-spinner";
// import { TinyEditor } from "./TinyEditor";
import AccountMenu from "../components/Account/AccountMenu";
import { Name } from "../components/Documents/AllDocuments";
import { Button } from "@/components/ui/button";
import { TinyEditor } from "./TinyEditor";

export const HourGlassSpinner = ({
	colors = ["#fff", "#ff0098"],
}: {
	colors?: [string, string];
}) => {
	return (
		<Hourglass
			visible={true}
			height="80"
			width="80"
			ariaLabel="hourglass-loading"
			wrapperStyle={{}}
			wrapperClass=""
			// colors={["#306cce", "#72a1ed"]}
			// colors={["#fff", "#ff0098"]}
			colors={colors}
		/>
	);
};

function AskAccess({ id }: { id: string }) {
	const navigate = useNavigate();
	return (
		<div className="px-2 text-dark500_light500 flex items-center h-full justify-center bg-slate-100">
			<div className="space-y-6">
				<div className="body-semibold tracking-wider">
					You do not have access to this file .
				</div>
				<Button
					type="button"
					onClick={async () => {
						try {
							await axios(
								`${base_url}/document/askPermission`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
										Authorization: GetBearerToken(),
									},
									data: {
										docId: id,
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
										The owner of the file has been notified
									</div>
								</div>
							);
							navigate("/");
						} catch (err: any) {
							toast(
								<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
									<div className="font-mono text-red-600">
										Error
									</div>
									<div className="">
										Please try again later !
									</div>
								</div>
							);
						}
					}}
					className="bg-docs-blue hover:bg-docs-blue-hover w-full  body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
				>
					Ask Permission
				</Button>
				<div className="small-regular text-light400_light500">
					* The owner of this file will be notified.
				</div>
			</div>
		</div>
	);
}
