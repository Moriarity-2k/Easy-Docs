import { Router } from "express";
import {
	Login,
	authenticate,
	logout,
	signUp,
} from "../controllers/authController";
import { updatePassword, updateUserName } from "../controllers/userController";

const router = Router();

router.route("/login").post(Login);
router.route("/signup").post(signUp);
router.route("/logout").post(authenticate, logout);

router.route("/user/updateUserName").post(authenticate, updateUserName);

router.route("/user/updatePassword").post(authenticate, updatePassword);

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
