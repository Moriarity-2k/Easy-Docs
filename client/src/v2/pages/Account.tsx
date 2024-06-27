import { useAuth } from "@/context/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import AccountMenu from "../components/Account/AccountMenu";
import { Name } from "../components/Documents/AllDocuments";
import DocsIcon from "../components/icons/Docs.svg";
import { useEffect } from "react";
import { HourGlassSpinner } from "./DocumentAccessCheck";

export default function Account() {
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

	if (authLoading) {
		return (
			<div className="flex items-center justify-center h-full py-20 w-full bg-opacity-50 backdrop-blur-md">
				<HourGlassSpinner colors={["#306cce", "#72a1ed"]} />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<div
				className="flex items-center justify-between w-full sticky top-0 p-4 max-sm:p-2 shadow-sm z-50 
            bg-white
             "
			>
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
						{Name(loggedInUser.name || "", 800)}
					</div>
					<div>
						<AccountMenu />
					</div>
				</div>
			</div>
			<div className="background-light800_dark400 flex-grow pt-16">
				<div
					className="mx-auto lg:w-[69%] max-lg:w-[90%] space-y-8 
                "
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
