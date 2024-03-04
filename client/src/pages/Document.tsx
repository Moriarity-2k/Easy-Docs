import { FaRegStar } from "react-icons/fa";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IEditorDisable, base_url } from "@/constants";
import toast from "react-hot-toast";
import EditorMceComponent from "@/components/EditorMceComponent";
import { Button } from "@/components/ui/button";
import { GetBearerToken } from "@/lib/helpers";

export default function Document_Editor() {
	// const { slug } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [editorDisable, setEditorDisable] = useState<IEditorDisable>({
		access: true,
		message: "loading",
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

				if (x.data.message === 10) {
					setEditorDisable({ access: true, message: "No Access" });
					toast.error("You cannot access this document");
				}

				if (x.data.message === 11) {
					navigate("/");
					toast.error("Document doesn't exist");
				}

				if (x.data.message === 0 || x.data.message === 1) {
					setEditorDisable({ access: false, message: "ok" });
				}

				if (x.data.message === 2) {
					setEditorDisable({ access: true, message: "view" });
				}
			} catch (err) {
				navigate("/");
				toast.error("Unable to connect to server");
			}
		}

		getAccess();
	}, []);

	return (
		<div className="bg-light-800 mt-8">
			<div className="space-y-6 lg:w-[90%] sm:w-[85%] max-sm:w-[96%] mx-auto pt-4">
				<div className="mx-auto">
					<div className="lg:h3-bold sm:h3-bold tracking-normal uppercase flex items-center space-x-10 justify-between">
						<div className="flex items-center space-x-2 text-docs-blue-hover">
							{title}
						</div>
						<span>
							<FaRegStar className="hover:cursor-pointer" />
						</span>
					</div>
				</div>

				<div className="shadow-gray-300 shadow-lg space-y-4">
					{editorDisable.access === true &&
					(editorDisable.message === "No Access" ||
						editorDisable.message === "loading") ? (
						<AskAccess id={id} />
					) : (
						<EditorMceComponent
							editorDisable={editorDisable}
							id={id}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function AskAccess({ id }: { id: string }) {
	return (
		<div className="px-2 py-4 mt-8 text-dark500_light500 flex-center ">
			<div className="space-y-6">
				<div className="body-semibold tracking-wider">
					You do not have access to this file .
				</div>
				<Button
					type="button"
					onClick={async () => {
						try {
							const x = await axios(
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

							toast.success(x.data.message);
						} catch (err: any) {
							toast.error(err.response.data.message);
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
