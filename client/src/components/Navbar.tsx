import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

import CircularDoc from "./icons/cirular-document.svg";
import Theme from "./Theme";
import { useAuth } from "@/context/useAuth";
import AccountMenu from "./AccountMenu";

export default function Navbar() {
	const navigate = useNavigate();

	const { loggedInUser } = useAuth();

	return (
		<div className="background-light900_dark300 border-b-2 dark:border-none dark:py-2">
			<div className="md:w-[90%] py-[1rem] items-center mx-auto flex justify-between">
				<div
					className="flex gap-4 max-sm:gap-2 items-center madimi-one-regular tracking-wider lg:text-[40px] sm:text-[30px] max-sm:text-[20px] uppercase hover:cursor-pointer"
					onClick={() => navigate("/")}
				>
					<div className="max-w-[100%]">
						<img src={CircularDoc} />
					</div>
					<span className="text-docs-blue">Easy</span>
					<span className="text-accent-blue">Docs</span>
				</div>
				<div className="flex items-center lg:gap-6 max-sm:gap-1 sm:gap-2 md:gap-4">
					{/* <div className="lowercase ">Create an account</div> */}
					<Theme />
					<Button
						type="button"
						className="bg-inherit dark:bg-inherit dark:border dark:border-light-700 px-6 body-semibold  dark:hover:bg-dark-200 dark:hover:border-light-900 uppercase tracking-widest subtle-semibold text-docs-blue-hover  dark:text-light-500  hover:bg-docs-blue hover:text-light-800 max-sm:text-[10px]"
						onClick={() => {
							console.log(loggedInUser);
							if (
								loggedInUser === undefined ||
								!Object.keys(loggedInUser).includes("email")
							)
								navigate("/register");
							// TODO: have to navigate to all docs
							else navigate("/");
						}}
					>
						{loggedInUser === undefined ||
						!Object.keys(loggedInUser).includes("email")
							? "create an account"
							: "GO To DOCS"}
					</Button>
					{loggedInUser === undefined ||
					!Object.keys(loggedInUser).includes("email") ? (
						<Button
							type="button"
							className="bg-docs-blue hover:bg-docs-blue-hover  dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold max-sm:text-[10px] max-sm:px-2 px-6"
							onClick={() => navigate("/login")}
						>
							Sign In
						</Button>
					) : (
						// <img
						// 	src={account}
						// 	className="hover:cursor-pointer invert lg:h-[25px] lg:w-[25] md:h-[20px] md:w-[20px] max-md:h-[12px] max-md:w-[12px] dark:filter-none"
						// 	onClick={() => {
						// 		navigate("/my-accounnt");
						// 	}}
						// />

                        <AccountMenu />
					)}
				</div>
			</div>
		</div>
	);
}
