import { Router } from "express";
import { Login, authenticate, logout, signUp } from "../controllers/authController";
// import user from "../models/user.model";
import { updatePassword } from "../controllers/userController";

const router = Router();

router.route("/login").post(Login);
router.route("/signup").post(signUp);
router.route('/logout').post(authenticate , logout);

router.route("/updatePassword").post(authenticate, updatePassword);


/**
 *
 * TODO:
 *
 * If Login
 *      date -- Name
 *      update -- password
 *
 * Else
 *      forgotPassword , Reset Password
 */

/*
    note: test -> tanstack
    router.route("/sayHello").get(authenticate, (req, res, next) => {
        res.status(200).json({
            status: "working",
        });
    });

    router.route("/allUsers").get(async (req, res, next) => {
        const users = await user.find({});

        res.status(200).json({
            users,
            status: "success",
        });
    });

    router.route("/updateName").post(async (req, res, next) => {
        const user_ = await user.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
        });

        res.status(200).json({
            user,
            status: "success",
        });
    });
*/

export default router;
