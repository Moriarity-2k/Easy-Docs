import DOCS_MAIN_SCREEN from "@/components/assets/DOCS_MAIN.png";
import DOCS_COLL from "@/components/assets/colloborate.webp";
import DOCS_SEAM from "@/components/assets/DOCS_F.png";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export default function Introsite() {
	const navigate = useNavigate();

	const { loggedInUser } = useAuth();
	const userNotExist =
		loggedInUser === undefined ||
		!Object.keys(loggedInUser).includes("email");

	return (
		<div className=" mx-auto mt-24 xl:w-[80%] max-xl:w-[95%] max-md:w-[80%] mb-4 space-y-8 text-light400_dark500">
			<div className="md:flex md:gap-16 items-center mb-32">
				<div className="text-dark100_light900 space-y-12 ">
					<div className="text-dark100_light900 text-[52px] leading-snug">
						Build your best ideas together, in Easy Docs
					</div>
					<div className="opacity-50 base-medium">
						Create and collaborate on online documents in real-time,
						enabling multiple users to contribute seamlessly from
						any device.
					</div>

					<div className="lg:hidden text-dark100_light900">
						<img
							src={DOCS_MAIN_SCREEN}
							className="w-[90%] mx-auto mt-8 dark:invert"
						/>
					</div>

					<div className="flex gap-8 items-center ">
						<div className="opacity-50">
							{userNotExist
								? "Don't have an account?"
								: "Try Docs for free"}
						</div>
						<Button
							type="button"
							onClick={() => {
								if (userNotExist) {
									navigate("/register");
								} else {
									navigate("/all-documents");
								}
							}}
							className="bg-docs-blue  hover:bg-docs-blue-hover body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
						>
							{userNotExist ? "Sign up for free" : "Go To Docs"}
						</Button>
					</div>
				</div>

				<div className="max-lg:hidden text-dark100_light900">
					<img
						src={DOCS_MAIN_SCREEN}
						className="w-[85%] mx-auto mt-8 dark:invert"
					/>
				</div>
			</div>

			<div className="flex max-lg:flex-col">
				<div className="space-y-6 w-[55%]">
					<div className="text-dark100_light900 text-[36px] leading-snug mt-16 capitalize">
						seamless colloboration
					</div>
					<div className="opacity-40 leading-9 text-dark400_light700">
						Edit together in real-time with easy sharing, and use
						comments, suggestions, and action items to keep things
						moving. Or use @-mentions to pull relevant people,
						files, and events into your online Docs for rich
						collaboration.
					</div>
				</div>
				<div>
					<img
						src={DOCS_COLL}
						className="w-[85%] mx-auto mt-8 max-lg:hidden dark:invert"
					/>
					<img
						src={DOCS_COLL}
						className="w-[90%] mx-auto mt-8 lg:hidden dark:invert"
					/>
				</div>
			</div>

			<div className="flex max-lg:flex-col">
				<div className="">
					<img
						src={DOCS_SEAM}
						className="w-[85%] mx-auto mt-8 max-lg:hidden dark:invert"
					/>
					<img
						src={DOCS_SEAM}
						className="w-[90%] mx-auto mt-8 lg:hidden dark:invert"
					/>
				</div>
				<div className="space-y-6">
					<div className="text-dark100_light900 text-[36px] leading-snug mt-16 capitalize">
						Store and share files in the cloud.
					</div>
					<div className="opacity-40 leading-9 text-dark400_light700">
						Keep all your work in one place with secure access from
						your computer, phone, or tablet. Quickly invite others
						to view, download, and collaborate on any file - no
						email attachment needed.
					</div>
				</div>
			</div>
		</div>
	);
}
