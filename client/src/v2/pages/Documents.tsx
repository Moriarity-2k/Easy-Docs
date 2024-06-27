import DocsIcon from "../components/icons/Docs.svg";
import AccountMenu from "../components/Account/AccountMenu";
import Modal from "../components/Modal";
import { FaStar } from "react-icons/fa";
import { GiPaintBrush } from "react-icons/gi";
import { PiShareFatLight } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { GoPlus } from "react-icons/go";
import AllDocuments from "../components/Documents/AllDocuments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";
import { CreateDocument } from "../components/Documents/CreateDocument";

export default function Documents() {
	const { loggedInUser, loading: authLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoading && (!loggedInUser || !loggedInUser.email)) {
			navigate("/login");
		}
	}, [loggedInUser, authLoading, navigate]);

	if (!loggedInUser || !loggedInUser.email) {
		return null;
	}

	return (
		<>
			<div className="flex items-center justify-between sticky w-full top-0 p-4 max-sm:p-2 shadow-sm z-50 bg-white">
				<div className="flex items-center gap-2 md:gap-4 cursor-pointer">
					<img src={DocsIcon} width={50} height={50} />
					<div className="font-mono text-lg font-semibold text-[#000000b7]">
						EasyDocs
					</div>
				</div>

				<div className="max-sm:hidden flex-grow">
					<DocumentSearchInput />
				</div>

				<div>
					<AccountMenu />
				</div>
			</div>

			<div className="sm:hidden mt-4 flex-grow">
				<DocumentSearchInput />
			</div>

			{/* Main after navbar */}
			<div className=" mx-auto max-sm:mt-8 max-sm:mx-5">
				{/* Section create document */}
				<div className="w-full h-80 bg-gray-100 flex justify-center items-center font-medium text-gray-700 px-4 overflow-hidden">
					<div className="w-full h-full max-w-4xl flex items-center gap-8">
						<Modal>
							<Modal.Open name="create-document">
								<div className=" py-4 space-y-4 overflow-auto">
									<h1>Start a new document</h1>
									<div className="flex items-center">
										<div className="space-y-2">
											<button className="h-52 w-40 bg-white border hover:border-blue-500 flex items-center justify-center">
												<span
													className={`${
														false && "opacity-0"
													}`}
												>
													<GoPlus className="w-16 h-16 text-red-500" />
												</span>
											</button>
										</div>
									</div>
								</div>
							</Modal.Open>
							<Modal.Window name="create-document">
								<CreateDocument />
							</Modal.Window>
						</Modal>
						<div className="space-y-2 lg:mb-2">
							{features.map((feature, i) => {
								return (
									<div
										className="flex items-center font-poppins gap-4 text-light-400 bg-[#ffffff70] px-5 py-2 border border-[#d5e6fa] text-sm hover:cursor-pointer hover:translate-x-4 transition-transform duration-300
                                        hover:bg-docs-blue
                                        hover:text-white
                                        max-sm:px-3
                                        max-sm:text-xs
                                        "
										key={i}
										style={{
											animation: "linear 1s ",
										}}
									>
										{feature.icon}{" "}
										<span className="max-sm:hidden">
											Feature {i + 1}:
										</span>{" "}
										{feature.text}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Table of documents */}
				<div className="pb-[100px]">
					<AllDocuments />
				</div>
			</div>
		</>
	);
}

export const features = [
	{ icon: <FaStar />, text: "collaborate in real-time" },
	{
		icon: <GiPaintBrush />,
		text: "Edit with ease",
	},
	{
		icon: <PiShareFatLight />,
		text: "Share effortlessly",
	},
];

function SvgSearch() {
	return (
		<svg
			focusable="false"
			height="24px"
			viewBox="0 0 24 24"
			width="24px"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path>
			<path d="M0,0h24v24H0V0z" fill="none"></path>
		</svg>
	);
}

function DocumentSearchInput() {
	return (
		<div className="bg-[#f0f4f9] mx-5 md:mx-20 px-4 py-2 flex items-center gap-2">
			<SvgSearch />
			<Input
				className="bg-inherit inset-0 outline-none border-none active:inset-0 active:border-none active:outline-none ring-0 active:ring-0 rounded-md w-full"
				placeholder="Search"
			/>
		</div>
	);
}
