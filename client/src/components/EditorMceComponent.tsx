import { useTheme } from "@/context/useTheme";
import { useEffect, useState } from "react";
import { SpiralSpinner } from "./Spinner";

import { Editor } from "@tinymce/tinymce-react";
import { IEditorDisable, base_url } from "@/constants";
import toast from "react-hot-toast";
import { useAuth } from "@/context/useAuth";
import GetSocket from "@/context/useSocket";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetBearerToken } from "@/lib/helpers";

export default function EditorMceComponent({
	editorDisable,
	id,
}: {
	editorDisable: IEditorDisable;
	id: string;
}) {
	const { currentTheme } = useTheme();
	const theme = currentTheme && currentTheme();

	const navigate = useNavigate();

	const { loggedInUser } = useAuth();

	const height_screen = window.innerHeight;

	const [editorContent, setEditorContent] = useState<string | null>(null);
	const [editorLoading, setEditorLoading] = useState<boolean>(true);

	useEffect(() => {
		const socket = GetSocket.SingleSocket();

		socket.emit("join-room", id, loggedInUser.name);
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
	}, [id, loggedInUser]);

	if (editorDisable.message !== "ok") {
		toast.error(editorDisable.message);
	}

	useEffect(() => {
		const socket = GetSocket.SingleSocket();
		socket.emit("send-to-rooms", id, editorContent);
	}, [editorContent, id]);

	useEffect(() => {
		const timer = setTimeout(async () => {
			await axios(`${base_url}/document/${id}`, {
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
		}, 500);

		return () => clearTimeout(timer);
	}, [editorContent, id]);

	const { isLoading, error, isError } = useQuery({
		queryKey: ["document-id"],
		queryFn: async () => {
			const data = await axios(`${base_url}/document/${id}`, {
				method: "GET",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			});
			setEditorContent(data.data.docs.content);
			return data.data;
		},
	});

	if (isLoading) {
		return <SpiralSpinner sz={90} color="#1a73e8" />;
	}

	if (isError) {
		toast.error(error.message);
		navigate("/");
	}

	return (
		<>
			{editorLoading === true && (
				<SpiralSpinner sz={90} color="#1a73e8" />
			)}
			<Editor
				apiKey={import.meta.env.VITE_TINY_EDITOR_APIKEY}
				onInit={() => {
					setEditorLoading(false);
				}}
				value={editorContent || undefined}
				onEditorChange={(new_value) => {
					setEditorContent(() => new_value);
				}}
				disabled={editorDisable.access}
				initialValue=""
				init={{
					height: 0.9 * height_screen,
					menu: {
						file: {
							title: "File",
							items: "restoredraft | preview | export print | deleteallconversations",
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
						"body { font-family:Helvetica,Arial,sans-serif; font-size:14px;}",

					skin: theme === "dark" ? "oxide-dark" : "oxide",
					content_css: theme === "dark" ? "dark" : "light",
				}}
			/>

			<div className="small-semibold text-red-800">
				* Files are saved automatically. E
			</div>
		</>
	);
}
