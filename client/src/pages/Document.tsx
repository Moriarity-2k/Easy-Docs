import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/useTheme";
import { FaRegStar } from "react-icons/fa";

import LOGO from "@/components/icons/Docs.svg";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "@/constants";

export default function Document_Editor() {
	const { slug } = useParams();
	const [searchParams] = useSearchParams();

	const title = searchParams.get("title");
	const id = searchParams.get("id");

	const { currentTheme } = useTheme();
	const theme = currentTheme && currentTheme();

	const height_screen = window.innerHeight;

	const [editorContent, setEditorContent] = useState<string | null>(null);

	useEffect(() => {
		const timer = setTimeout(async () => {
			console.log("Request Sent");
			const updated_data = await axios(`${base_url}/document/${id}`, {
				method: "POST",
				data: {
					content: editorContent,
				},
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(updated_data);
			return updated_data;
		}, 3000);

		return () => clearTimeout(timer);
	}, [editorContent, id]);

	return (
		<div className="bg-light-800">
			<div className="space-y-6 lg:w-[80%] sm:w-[85%] max-sm:w-[96%] mx-auto pt-8">
				<div className="mx-auto">
					<div className="lg:h2-bold sm:h3-bold tracking-normal uppercase flex items-center space-x-10">
						<div className="flex items-center space-x-2">
							<img src={LOGO} width={40} height={40} />
							<span className=" text-docs-blue-hover">
								{title}
							</span>
						</div>
						<span>
							<FaRegStar className="hover:cursor-pointer" />
						</span>
					</div>
				</div>
				<div className="shadow-gray-300 shadow-lg space-y-4">
					<Editor
						apiKey={import.meta.env.VITE_TINY_EDITOR_APIKEY}
						// onInit={(evt, editor) => (editorRef.current = editor)}
						// onChange=
						onEditorChange={(new_value) => {
							setEditorContent(() => new_value);
						}}
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
								"print preview fullpage paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount spellchecker imagetools textpattern noneditable help charmap quickbars emoticons",
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
						* Files are saved automatically.
					</div>
				</div>
			</div>
		</div>
	);
}
