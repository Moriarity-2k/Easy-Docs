import { UserOnRequest } from "../TypeHelpers/helpers";
import user from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import document from "../models/document.model";
import AppError from "../utils/appError";

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

		// console.log({ pass, new_pass });

		// console.log({ user: req.user_ });

		const new_user = await user.findById(req.user_?._id);

		// console.log({ new_user });

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

export const getNotifications = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		// checkOut the accessPerms -> for Each id , send the username and email and documentName

		const permissionsArr = req.user_!.AccessPermission;

		const notifications = [];

		for (const per of permissionsArr) {
			const per_user_ = await user
				.findById(per.userId)
				.select("name active email");

			const docs = await document.findById(per.docId).select("title");

			if (!docs) continue;

			if (per_user_?.active) {
				notifications.push({
					username: per_user_.name,
					// email: per_user_.email,
					id: docs.id,
					title: docs.title,
				});
			}
		}

		res.status(200).json({
			status: "success",
			notifications,
		});
	}
);

export const querySearch = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		// console.log(req.query);
		const { username: name_to_search, docId } = req.query;

		console.log({ docId, name_to_search });

		if (!docId || !name_to_search) {
			// return res.status(400).json({
			// status : 'bad request' ,
			// message : 'please '
			// })
			return next(new AppError("bad request", 400));
		}

		// TODO: search and limit the search for 5

		console.log(req.user_);

		const search_results = await user
			.find({
				_id: {
					$ne: req.user_?._id,
				},
				name: {
					$regex: new RegExp(`${name_to_search}`, "i"),
				},
				// don't search in emails
				// 	},
				// ],
				"sharedDocuments.documentId": {
					$ne: docId,
				},
			})
			.select("name -_id")
			.limit(5);

		// const userNames = x.map((user) => {
		// 	return user.name;
		// });

		// console.log({ search_results });

		res.status(200).json({
			status: "success",
			users: search_results,
		});
	}
);
