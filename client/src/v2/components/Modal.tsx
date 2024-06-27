import {
	ReactElement,
	ReactNode,
	cloneElement,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

interface IModalContext {
	closeModal: () => void;
	openModal: (name: string) => void;
	open: string;
}

const ModalContext = createContext<IModalContext | null>(null);

function Modal({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState<string>("");

	const closeModal = () => setOpen("");
	const openModal = (name: string) => setOpen(name);

	return (
		<ModalContext.Provider value={{ closeModal, openModal, open }}>
			{children}
		</ModalContext.Provider>
	);
}

function Open({ children, name }: { children: ReactElement; name: string }) {
	const values = useContext(ModalContext);

	return cloneElement(children, {
		onClick: () => values?.openModal(name),
	});
}

function Window({ children, name }: { children: ReactElement; name: string }) {
	const values = useContext(ModalContext);

	const ref = useRef(null);

	useEffect(() => {
		if (!ref) return;

		const HandleClick = (e: any) => {
			if (ref.current === e.target) {
				console.log("getting closed");
				values?.closeModal();
			}
		};
		document.addEventListener("click", HandleClick);

		return () => document.removeEventListener("click", HandleClick);
	}, [values]);

	if (values?.open !== name) return;

	return createPortal(
		<div
			className="backdrop-blur-sm w-full h-screen absolute top-0 left-0 flex-center z-10 bg-[#00000036]"
			ref={ref}
		>
			<div
				className="border-2 light-border-2 xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-full max-sm:w-full mx-auto p-[2rem] background-light800_dark400 z-100 rounded-md"
				style={{
					boxShadow: "4px 4px 5px rgba(0, 0, 0, 0)",
				}}
			>
				<MdClose
					className="h1-bold hover:cursor-pointer float-right"
					onClick={values.closeModal}
				/>
				<div
					className=""
					style={{
						boxShadow: "4px 4px 5px rgba(0, 0, 0, 0)",
					}}
				>
					{children}
				</div>
			</div>
		</div>,
		document.querySelector("#root")!
	);
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
