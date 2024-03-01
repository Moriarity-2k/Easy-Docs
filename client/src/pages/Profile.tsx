import { useAuth } from "@/context/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
	const { loggedInUser } = useAuth();
	const navigate = useNavigate();

	if (
		loggedInUser === undefined ||
		!Object.keys(loggedInUser).includes("name")
	) {
		toast("Please login for further details");
		navigate("/");
		return;
	}

	return (
		<div>
			<div>
				<div>Notifications</div>
			</div>
		</div>
	);
}
