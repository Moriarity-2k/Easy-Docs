import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

import account from "./icons/account.svg";
import { useAuth } from "@/context/useAuth";

export default function AccountMenu() {
	const navigate = useNavigate();
	const { Logout } = useAuth();
	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className=" focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
					<img
						src={account}
						className="hover:cursor-pointer invert lg:h-[25px] lg:w-[25] md:h-[20px] md:w-[20px] max-md:h-[12px] max-md:w-[12px] dark:filter-none"
					/>
				</MenubarTrigger>
				<MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300 bg-light-900 focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer">
					<MenubarItem
						key={"account"}
						className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400 "
						onClick={() => navigate("/my-account")}
					>
						My Account
					</MenubarItem>

					<MenubarItem
						key={"dark"}
						className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400 "
						onClick={Logout}
					>
						Logout
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
