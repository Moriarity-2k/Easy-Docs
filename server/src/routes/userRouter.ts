import { Router } from "express";
import {
	Login,
	authenticate,
	logout,
	signUp,
} from "../controllers/authController";
import {
	getNotifications,
	querySearch,
	updatePassword,
	updateUserName,
} from "../controllers/userController";
import user from "../models/user.model";

const router = Router();

router.route("/login").post(Login);
router.route("/signup").post(signUp);
router.route("/logout").post(authenticate, logout);

router.route("/user/updateUserName").post(authenticate, updateUserName);

router.route("/user/updatePassword").post(authenticate, updatePassword);

router.route("/user/querysearch").get(authenticate, querySearch);

router.route("/user/notifications").get(authenticate, getNotifications);

router.route("/user/search").get(async (req, res, next) => {
	const { name } = req.query;
	// console.log({ name });;

	const val = await user.find({ name }).select("name");

	console.log("USER : ", val);

	if (val.length) {
		return res.status(200).json({
			message: "Document name already exists",
			ok: 0,
		});
	}

	return res.status(200).json({
		message: "success",
		ok: 1,
	});
});

/**
 *
 * TODO:
 *
 * If Login -> DONE
 *      date -- Name
 *      update -- password
 *
 * Else
 *      forgotPassword
 *      Reset Password
 */

export default router;
