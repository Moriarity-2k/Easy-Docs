import { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import document from "../models/document.model";
import user, { IUser } from "../models/user.model";
import { SCOPE, UserOnRequest } from "../TypeHelpers/helpers";

export const createDocument = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const body = req.body;
		const doc = await document.create({
			title: body.title,
			adminId: req.user_?._id,
			isPublic: body.public,
			// access: [{ userId: body.userId, scope: SCOPE.ADMIN }],
		});

		res.status(201).json({
			status: "success",
			message: "Document creation successful",
			doc,
		});
	}
);

export const updateDocument = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {}
);

/**
 * if Doc exists and created by the same user
 *
 * Features: (didn't implement by
 * Rather than just deleting , make it unavailable , just in case user wants
 */

export const deleteDocument = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const docId = req.params.id;
		const userId = req.user_?._id;

		const doc = await document.findById(docId);

		if (!doc) {
			return res.status(404).json({
				status: "Not Found",
				message: "NO DOCUMENT FOUND !!",
			});
		}

		if (doc.adminId !== userId) {
			return res.status(401).json({
				status: "success",
				message: "Document deleted successfully",
			});
		}

		await document.findByIdAndDelete(docId);
		res.status(204).json({
			status: "success",
			message: "Document deleted successfully",
		});

		// TODO: If couldn't delete have to find a way to update
		await user.updateMany({
			$pull: { sharedDocuments: { documentId: docId } },
		});
	}
);
