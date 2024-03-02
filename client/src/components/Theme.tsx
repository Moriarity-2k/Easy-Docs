"use client";

import light from "./icons/light.svg";
import dark from "./icons/dark.svg";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/useTheme";

const Theme = () => {
	const { currentTheme, changeTheme } = useTheme();

	const theme = currentTheme!();

	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className=" focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
					{theme === "light" ? (
						<img src={light} alt="light" width={20} height={20} />
					) : (
						<img
							src={dark}
							alt="dark"
							width={20}
							height={20}
							// className="w-24"
						/>
					)}
				</MenubarTrigger>
				<MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300 bg-light-900 focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer">
					<MenubarItem
						key={"light"}
						onClick={() => {
							if (theme === "light") return;
							changeTheme!();
						}}
						className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400 "
					>
						<img
							src={light}
							alt={"light"}
							width={16}
							height={16}
							className={`${theme === "light" && "active-theme"}`}
						/>
						<p
							className={`body-semibold text-light-500 ${
								theme === "light"
									? "text-primary-500"
									: "text-dark100_light900"
							}`}
						>
							Light
						</p>
					</MenubarItem>

					<MenubarItem
						key={"dark"}
						onClick={() => {
							if (theme === "dark") return;
							changeTheme!();
						}}
						className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400 "
					>
						<img
							src={dark}
							alt={"dark"}
							width={16}
							height={16}
							className={`${theme === "dark" && "active-theme"}`}
						/>
						<p
							className={`body-semibold text-light-500 ${
								theme === "dark"
									? "text-primary-500"
									: "text-dark100_light900"
							}`}
						>
							Dark
						</p>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};

export default Theme;
