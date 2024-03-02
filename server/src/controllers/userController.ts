import { UserOnRequest } from "../TypeHelpers/helpers";
import user from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";

export const updateUserName = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const name = req.body.name;

		const updatedUser = await user.findByIdAndUpdate(req.user_!._id, {
			name: req.body.name,
		});

		if (updatedUser) req.user_ = updatedUser;

		res.status(200).json({
			status: "success",
			message: "user name updated successfully",
		});
	}
);

/**
 * note: features :
 * same password or not
 */

async function comparePasswords(password: string, hashString: string) {
	return await bcrypt.compare(password, hashString);
}

export const updatePassword = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const pass = req.body.password;
		const new_pass = req.body.new_pass;

		console.log({ pass, new_pass });

		// console.log({ user: req.user_ });

		const new_user = await user.findById(req.user_?._id);

		console.log({ new_user });

		const z = await comparePasswords(pass, new_user?.password!);

		if (z === false) {
			return res.status(400).json({
				status: "fail",
				message: "Passwords do not match",
			});
		}

		// bcrypt compare
		new_user!.password = new_pass;
		const updated_user = await new_user!.save();

		res.status(200).json({
			status: "success",
			message: "Password updated successfully",
		});
	}
);
