import Modal from "./Modal";
import SearchResultsWindow from "./SearchResultsWindow";
import { Button } from "./ui/button";

export default function ShareDocsSearchComponent({ id }: { id: string }) {
	return (
		<Modal>
			<Modal.Open name="user_name_search_window">
				<Button
					type="button"
					className="bg-docs-blue hover:bg-docs-blue-hover w-max py-2 px-4  body-semibold dark:bg-docs-blue dark:hover:bg-docs-blue-hover text-white dark:text-white uppercase tracking-widest subtle-semibold"
				>
					Share
				</Button>
			</Modal.Open>
			<Modal.Window name="user_name_search_window">
				<SearchResultsWindow id={id} />
			</Modal.Window>
		</Modal>
	);
}
