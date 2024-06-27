import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

import { IoNotificationsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "@/context/useAuth";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function AccountMenu() {
	const navigate = useNavigate();
	const { Logout, loggedInUser } = useAuth();

	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className=" focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
					<div className="bg-docs-blue text-white px-4 py-[11px] rounded-full cursor-pointer">
						{(loggedInUser &&
							loggedInUser.name &&
							loggedInUser.name[0]) ||
							"U"}
					</div>
				</MenubarTrigger>
				<MenubarContent className="absolute right-[-3rem] mt-3 min-w-[180px] rounded-md bg-white cursor-pointer focus:bg-light-800 shadow-lg ">
					<MenubarItem
						key={"account"}
						className="cursor-pointer flex items-center gap-4 px-4 py-2 focus:bg-docs-blue focus:text-white font-mono"
						onClick={() => navigate("/account/details")}
					>
						<MdOutlineAccountCircle />
						My Account
					</MenubarItem>

					<MenubarItem
						key={"dark"}
						className="cursor-pointer flex items-center gap-4 px-4 py-2 focus:bg-docs-blue focus:text-white font-mono"
						onClick={Logout}
					>
						<CiLogout />
						Logout
					</MenubarItem>

					<MenubarItem
						key={"notify"}
						className="cursor-pointer flex items-center gap-4 px-4 py-2 focus:bg-docs-blue focus:text-white font-mono"
						onClick={() => navigate("/account/notifications")}
					>
						<IoNotificationsOutline />
						Notifications
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
