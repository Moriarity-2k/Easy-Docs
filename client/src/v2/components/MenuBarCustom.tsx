/**
 * Trigger Name : Actions
 *
 * Rename
 * Delete
 * Share with user
 * Share anyone with link
 * Visibility
 */

import { base_url } from "@/constants";
import { GetBearerToken } from "../lib/helpers";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import { useState } from "react";
import { HourGlassSpinner } from "../pages/DocumentAccessCheck";
import { IoPeople } from "react-icons/io5";
import Modal from "./Modal";
import UserNameSearchPanel from "./ShareWithUser/UserNameSearchPanel";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MenuBarCustom({
	docId,
	docData,
}: {
	docData: any;
	docId: string;
}) {
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const [isPublic, setIsPublic] = useState<boolean>(docData.isPublic);

	const handleDelete = async () => {
		// TODO: add notifications -> handled

		setLoading(true);
		try {
			/**
			 * Delete the document first ? go to all docs : toast
			 */
			await deleteDocument(docId);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Sucess 🎉🎉</div>
					<div className="">
						Document has been deleted successfully
					</div>
				</div>
			);
			navigate("/");
		} catch (err) {
			console.log(err);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Something went wrong. Try again later
					</div>
				</div>
			);
		} finally {
			setLoading(false);
		}
	};

	const handleVisibilityChange = async () => {
		setLoading(true);

		// TODO: Notifications -> handled
		try {
			await changeVisibility(docId, isPublic);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Sucess 🎉🎉</div>
					<div className="">
						Document has been made {isPublic ? "Private" : "Public"}
					</div>
				</div>
			);
			setIsPublic((x) => !x);
		} catch (err) {
			console.log(err);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Something went wrong. Try again later.
					</div>
				</div>
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center">
				<HourGlassSpinner colors={["#306cce", "#72a1ed"]} />
			</div>
		);
	}

	return (
		<div className="border-none bg-transparent shadow-none">
			<div className="space-y-8">
				{/* Rename */}
				<div></div>

				{/* Access */}
				<div className="font-poppins text-black space-y-4">
					<div className="poppins-semibold text-xl max-md:text-lg">
						General Access
					</div>
					<div>
						{docData != null && (
							<div className="ml-4">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={isPublic}
										className=" *: "
										onChange={handleVisibilityChange}
									/>
									<label>Public</label>
								</div>
								<div className="text-red-600 text-xs">
									{isPublic
										? "The document is public. Anyone with the link can access it"
										: "The document is private. Only you can access it"}
								</div>
								{isPublic && (
									<div>
										<Modal>
											<Modal.Open name="shareWithUser">
												<div className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-white transition-colors focus-visible:outline-none mt-4 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-blue-600 cursor-pointer text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 text-sm font-medium">
													<IoPeople />
													<span className="ml-4 max-md:ml-2">
														Share with User
													</span>
												</div>
											</Modal.Open>
											<Modal.Window name="shareWithUser">
												<UserNameSearchPanel
													id={docId}
												/>
											</Modal.Window>
										</Modal>

										{/* TODO: share with anyone */}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Delete */}
				<div
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 hover:text-red-800 hover:font-extrabold dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 text-sm font-medium cursor-pointer font-mono"
					onClick={handleDelete}
				>
					<FiTrash className="font-bold text-lg" />
					<span className="ml-4 max-md:ml-2">Delete</span>
				</div>
			</div>
		</div>
	);
}

export const deleteDocument = async (documentId: string) => {
	if (!documentId) return;

	const resp = await axios(`${base_url}/document/${documentId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: GetBearerToken(),
		},
		withCredentials: true,
	});

	return resp;
};

export const changeVisibility = async (
	documentId: string,
	isPublic: boolean
) => {
	if (!documentId) return;

	const resp = await axios(`${base_url}/document/${documentId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: GetBearerToken(),
		},
		data: {
			isPublic,
		},
		withCredentials: true,
	});

	return resp;
};
