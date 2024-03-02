import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

interface IThemeContext {
	changeTheme: () => void;
	currentTheme: () => string;
}

const ThemeContext = createContext<IThemeContext | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<string>("light");

	const currentTheme = () => theme;
	const changeTheme = () =>
		setTheme((x) => (x === "light" ? "dark" : "light"));

	useEffect(() => {
		const changePreference = () => {
			const doc = document.querySelector("body");
			if (theme === "light") {
				if (doc?.classList.contains("dark")) {
					doc.classList.remove("dark");
				}
			} else {
				if (!doc?.classList.contains("dark")) {
					doc?.classList.add("dark");
				}
			}
		};
		changePreference();
	}, [theme]);

	useEffect(() => {
		const x = window.matchMedia("(prefers-color-scheme: dark)");
		if (x.matches) {
			setTheme("dark");
		}
	}, []);

	return (
		<ThemeContext.Provider value={{ currentTheme, changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

// eslint-disable-next-line
export function useTheme() {
	const values = useContext(ThemeContext);
	return { ...values };
}
