import { useAuth } from "@/context/useAuth";
import UserNameUpdate from "../components/UserNameUpdate";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";
import { useNavigate } from "react-router-dom";

export default function Account() {
	const { loggedInUser, onSubmitUserNameChange, onSubmitPasswordChange } =
		useAuth();

	const navigate = useNavigate();

	if (
		loggedInUser === undefined ||
		!Object.keys(loggedInUser).includes("email")
	)
		navigate("/");
	return (
		<div className="mx-auto lg:w-[69%] max-lg:w-[90%] mt-16 space-y-8">
			<div className="h3-bold text-light400_light500 text-dark100_light900">
				Hello , {loggedInUser.name}
			</div>

			<UserNameUpdate onSubmitUserNameChange={onSubmitUserNameChange!} />
			<PasswordUpdateForm
				onSubmitPasswordChange={onSubmitPasswordChange!}
			/>

			<div className="body-regular mt-8 text-red-600 subtle-semibold">
				* Additional features will be accessible shortly. P
			</div>
		</div>
	);
}
