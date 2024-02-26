import { UserOnRequest } from "../TypeHelpers/helpers";
import user from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Response } from "express";

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
export const updatePassword = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const pass = req.body.password;

		console.log({ user: req.user_ });

		const new_user = await user.findById(req.user_?._id);

		new_user!.password = pass;
		const updated_user = await new_user!.save();

		console.log({ updated_user });

		res.status(200).json({
			status: "success",
			message: "Password updated successfully",
		});
	}
);
