// TODO: Add a saving button on right

import DocsIcon from "../components/icons/Docs.svg";
import AccountMenu from "../components/Account/AccountMenu";
import { useEffect, useLayoutEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { IoPeople } from "react-icons/io5";
import { Name } from "../components/Documents/AllDocuments";
import { IEditorDisable, base_url } from "@/constants";
import { HourGlassSpinner } from "./DocumentAccessCheck";
import Modal from "../components/Modal";
import MenuBarCustom from "../components/MenuBarCustom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetBearerToken } from "../lib/helpers";
import toast from "react-hot-toast";
import GetSocket from "@/context/useSocket";
import { useAuth } from "@/context/useAuth";
import { useNavigate } from "react-router-dom";

interface ITinyEditor {
	title: string;
	editorDisable: IEditorDisable;
	docId: string;
}

export function TinyEditor({ title, editorDisable, docId }: ITinyEditor) {
	const [editorLoading, setEditorLoading] = useState<boolean>(true);
	const [editorContent, setEditorContent] = useState<string | null>(null);

	const [width, setWidth] = useState<number>(window.innerWidth);

	const navigate = useNavigate();

	const { loggedInUser } = useAuth();

	// socket initiali - working fine
	useEffect(() => {
		const socket = GetSocket.SingleSocket();

		socket.emit("join-room", docId, loggedInUser!.name);
		socket.on("change-in-content-from-server", (res) => {
			// console.log({ res });
			setEditorContent(res);
		});

		socket.on("someone-joined", (res) => {
			toast(`${res} joined the room`);
			// console.log(res);
		});

		return () => {
			socket.off("change-in-content-from-server");
			socket.off("someone-joined");
		};
	}, [docId, loggedInUser]);

	useLayoutEffect(() => {
		function HandleResize(e: Event) {
			setWidth((e.target as Window).outerWidth);
		}

		window.addEventListener("resize", HandleResize);
		return () => window.removeEventListener("resize", HandleResize);
	}, []);

	// Get Document - working fine
	const {
		isLoading,
		isError: fetchError,
		data: docData,
	} = useQuery({
		queryKey: ["document-id"],
		queryFn: async () => {
			const initialData = await axios(`${base_url}/document/${docId}`, {
				method: "GET",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: GetBearerToken(),
				},
			});
			setEditorContent(initialData.data.docs.content);
			return initialData.data.docs;
		},
	});

	useEffect(() => {
		if (!docId) return;
		const timer = setTimeout(async () => {
			// sending the content to store in DB
			console.log("Saving ...");
			await axios(`${base_url}/document/${docId}`, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: GetBearerToken(),
				},
				method: "POST",
				data: {
					content: editorContent,
				},
			});
		}, 1000);

		return () => clearTimeout(timer);
	}, [editorContent, docId]);

	if (fetchError) {
		toast(
			<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
				<div className="font-mono text-red-600">Error</div>
				<div className="">Sorry could not load the document </div>
			</div>
		);
		navigate("/");
	}

	return (
		<div className="">
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
						{Name(title || "Empty Document", width)}
					</div>
					{/* <ShareButton
						docId={docId}
						// isAdmin={editorDisable.isAdmin}
					/> */}
					{editorDisable.isAdmin && !isLoading && docData != null && (
						<DocumentActions docId={docId} docData={docData} />
					)}
					<div>
						<AccountMenu />
					</div>
				</div>
			</div>
			{editorLoading && (
				<div className="flex items-center justify-center h-full w-full bg-opacity-50 backdrop-blur-md">
					<HourGlassSpinner colors={["#306cce", "#72a1ed"]} />
				</div>
			)}
			<Editor
				apiKey={import.meta.env.VITE_TINY_EDITOR_APIKEY}
				onInit={() => {
					setEditorLoading(false);
				}}
				value={editorContent || undefined}
				// TODO:
				onEditorChange={(new_value) => {
					setEditorContent(() => new_value);
				}}
				/**
				 * Disables the editor if the state is only view
				 */
				disabled={editorDisable.message === "view"}
				/**
				 * On Dirty -> not working for socket
				 */
				// onDirty={(value) => {
				// 	console.log({ value });
				// 	const socket = GetSocket.SingleSocket();
				// 	socket.emit("send-to-rooms", id, editorContent);
				// }}
				onKeyUp={() => {
					// console.log({a});
					const socket = GetSocket.SingleSocket();
					socket.emit("send-to-rooms", docId, editorContent);
				}}
				initialValue=""
				init={{
					height: "100vh",
					menu: {
						file: {
							title: "File",
							items: "restoredraft | preview | export | print | deleteallconversations",
						},
						edit: {
							title: "Edit",
							items: "undo redo | cut copy paste pastetext | selectall | searchreplace",
						},
						view: {
							title: "View",
							items: "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
						},
						insert: {
							title: "Insert",
							items: "image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
						},
						format: {
							title: "Format",
							items: "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
						},
						tools: {
							title: "Tools",
							items: "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
						},
						table: {
							title: "Table",
							items: "inserttable | cell row column | advtablesort | tableprops deletetable",
						},
						help: { title: "Help", items: "help" },
					},
					plugins:
						"preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",

					toolbar_mode: "floating",
					toolbar_sticky: true,
					toolbar:
						"undo redo | formatselect | bold italic strikethrough forecolor backcolor blockquote | fontfamily fontsizeinput | link table image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat fullscreen",

					content_style:
						"body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color : #F8F9FA}",
					// skin: theme === "dark" ? "oxide-dark" : "oxide",
					// content_css: theme === "dark" ? "dark" : "light",
				}}
			/>

			{/* TODO: All the current colloborators */}
			{!editorLoading && <div>Live Collaborators ...</div>}
		</div>
	);
}

// export const ShareButton = ({
// 	docId,
// }: // isAdmin,
// {
// 	// isAdmin: boolean;
// 	docId: string;
// }) => {
// 	return (
// 		<DocumentMenu docId={docId}>
// 			<div className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 text-sm font-medium">
// 				<IoPeople />
// 				<span className="ml-4 max-md:ml-2">Actions</span>
// 			</div>
// 		</DocumentMenu>
// 	);
// };

export const DocumentActions = ({
	docId,
	docData,
}: {
	docData: any;
	docId: string;
}) => {
	return (
		<Modal>
			<Modal.Open name="DocumentActions">
				<div className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 text-sm font-medium cursor-pointer">
					<IoPeople />
					<span className="ml-4 max-md:ml-2">Actions</span>
				</div>
			</Modal.Open>
			<Modal.Window name="DocumentActions">
				<MenuBarCustom docId={docId} docData={docData} />
			</Modal.Window>
		</Modal>
	);
};
