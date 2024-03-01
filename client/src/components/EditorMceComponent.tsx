import { useTheme } from "@/context/useTheme";
import { useEffect, useState } from "react";
import { SpiralSpinner } from "./Spinner";

import { Editor } from "@tinymce/tinymce-react";
import { IEditorDisable, socket_url } from "@/constants";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuth } from "@/context/useAuth";
import GetSocket from "@/context/useSocket";

export default function EditorMceComponent({
	editorDisable,
	id,
}: {
	editorDisable: IEditorDisable;
	id: string;
}) {
	const { currentTheme } = useTheme();
	const theme = currentTheme && currentTheme();

	const { loggedInUser } = useAuth();

	const height_screen = window.innerHeight;

	const [editorContent, setEditorContent] = useState<string | null>(null);
	const [editorLoading, setEditorLoading] = useState<boolean>(true);

	// const change_in_content_from_server = (res: any) => {
	// 	setEditorContent(res);
	// };

	useEffect(() => {
		const socket = GetSocket.SingleSocket();

		socket.emit("join-room", id, loggedInUser.name);
		socket.on("change-in-content-from-server", (res) => {
			console.log({ res });
			setEditorContent(
				res === "" ? null : res
				// === null ? "   " : res
			);
		});

		socket.on("someone-joined", (res) => {
			toast(`${res} joined the room`);
			console.log(res);
		});

		return () => {
			socket.off("change-in-content-from-server");
			socket.off("someone-joined");
			// socket.disconnect();
		};
	}, [id, loggedInUser]);

	if (editorDisable.message !== "ok") {
		toast.error(editorDisable.message);
	}

	useEffect(() => {
		const socket = GetSocket.SingleSocket();
		socket.emit(
			"send-to-rooms",
			id,
			editorContent
			// === null ? "  " : editorContent
		);
	}, [editorContent, id]);

	return (
		<>
			{editorLoading === true && (
				<SpiralSpinner sz={90} color="#1a73e8" />
			)}
			<Editor
				apiKey={import.meta.env.VITE_TINY_EDITOR_APIKEY}
				// onInit={(evt, editor) => (editorRef.current = editor)}
				onInit={() => {
					setEditorLoading(false);
				}}
				// onChange=
				value={editorContent || undefined}
				onEditorChange={(new_value) => {
					setEditorContent(() => new_value);
				}}
				disabled={editorDisable.access}
				initialValue=""
				init={{
					height: 0.9 * height_screen,
					// menubar: true,
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
					// note: plugins : minimal
					// plugins: [
					// 	"advlist",
					// 	"autolink",
					// 	"lists",
					// 	"link",
					// 	"image",
					// 	"charmap",
					// 	"preview",
					// 	"anchor",
					// 	"searchreplace",
					// 	"visualblocks",
					// 	"code",
					// 	"fullscreen",
					// 	"insertdatetime",
					// 	"media",
					// 	"table",
					// 	"code",
					// 	"help",
					// ],
					toolbar_mode: "floating",
					toolbar_sticky: true,
					toolbar:
						// note: format - too Much
						// 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl'

						// note: format - minimal
						"undo redo | formatselect | bold italic strikethrough forecolor backcolor blockquote | fontfamily fontsizeinput | link table image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat fullscreen",

					// note: format - 3
					// "undo redo | blocks | " +
					// "bold italic forecolor | alignleft aligncenter " +
					// "alignright alignjustify | bullist numlist outdent indent | " +
					// "removeformat | help",
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
