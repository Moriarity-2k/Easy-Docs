import { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import document, { IDocument } from "../models/document.model";
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

		console.log({ doc });

		res.status(201).json({
			status: "success",
			message: "Document creation successful",
			file: {
				title: doc.title,
				slug: doc.slug,
				id: doc.id,
			},
		});
	}
);

export const getAllDocuments = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const docs = await document
			.find({ adminId: req.user_?._id })
			.select("title createdOn slug")
			.sort({ createdOn: "desc" });

		const adminDocs = [...docs];
		const sharedDocs = [];

		for (const x of req.user_?.sharedDocuments!) {
			const doc = (await document.findById(x.documentId)) as IDocument;

			if (doc)
				sharedDocs.push({
					id: doc._id,
					title: doc.title,
					createdOn: doc.createdOn,
					slug: doc.slug,
				});
		}

		res.status(200).json({
			status: "success",
			docs: {
				adminDocs,
				sharedDocs,
			},
		});
	}
);

export const getDocument = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const doc = await document.findById(req.params.id);

		if (!doc) {
			return res.status(404).json({
				status: "fail",
				message: "sorry , the document doesn't exist",
			});
		}

		res.status(200).json({
			status: "success",
			docs: doc,
		});
	}
);

export const getAccess = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const id = req.params.id;

		const doc_ = await document.findById(id);

		// No doc exist
		if (!doc_) {
			return res.status(404).json({
				status: "Not Found",
				message: 11,
			});
		}

		// user === admin
		if (req.user_?.id === String(doc_.adminId)) {
			return res.status(200).json({
				status: "success",
				message: SCOPE.ADMIN,
			});
		}

		const user_ = req.user_;

		// user has access to the doc through sharing
		for (const x of user_?.sharedDocuments!) {
			if (x.documentId === id) {
				return res.status(200).json({
					status: "success",
					message: x.role,
				});
			}
		}

		res.status(200).json({
			status: "fail",
			message: 10,
		});
	}
);

export const updateDocument = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const new_doc = await document.findByIdAndUpdate(req.params.id, {
			content: req.body.content,
		});
		res.status(200).json({
			status: "success",
			message: "data received",
		});
	}
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

export const getPermission = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		// docId -> findOne it check the adminId , if user present , put it in the AccPer

		const docId = req.body.docId;
		const doc_ = await document.findById(docId);

		if (!doc_) {
			return res.status(400).json({
				status: "fail",
				message: "Sorry , the document is probably deleted !",
			});
		}

		const adminId = doc_.adminId;
		const reqBy = req.user_?._id!;

		const admin_ = await user.findById(adminId);

		if (!admin_) {
			return res.status(400).json({
				status: "fail",
				message: "Sorry , unable to process your request",
			});
		}

		admin_.AccessPermission.filter((eachPerm) => {
			if (eachPerm.docId === docId && eachPerm.userId === reqBy) {
				return res.status(200).json({
					status: "success",
					message: "You have already sent the request",
				});
			}
		});

		admin_.AccessPermission.push({ userId: reqBy, docId: docId });
		await admin_.save();

		// const x = await user.findByIdAndUpdate(adminId, {
		// 	$addToSet: {
		// 		AccessPermission: reqBy,
		// 	},
		// });

		res.status(200).json({
			status: "success",
			message: "The request has been sent !",
		});
	}
);

// changed Access Permsiio
// object of userId , docId
export const grantPermission = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		// send the email , docId from body , find the user , if exists
		// => pull out the userId from the admin's accessPerm
		// => user's sharedDocs , insert the docId with permission
		// for now grant all

		const emailId = req.body.email;
		const docId = req.body.docId;

		console.log(emailId, docId);

		const req_user_ = await user.findOne({ email: emailId })!;

		req.user_!.AccessPermission = req.user_!.AccessPermission.filter(
			(eachPerm) => {
				console.log(
					eachPerm.docId.toString() === docId,
					eachPerm.userId,
					req_user_?._id
				);
				return !(
					eachPerm.docId.toString() === docId &&
					eachPerm.userId.toString() === req_user_?._id.toString()
				);
			}
		);
		await req.user_!.save();

		if (!req_user_) {
			return res.status(400).json({
				status: "fail",
				message: "user doesn't exist",
			});
		}

		if (req_user_ && !req_user_.active) {
			return res.status(200).json({
				status: "fail",
				message: "Cannot process request .The user doesn't exist",
			});
		}

		const new_req_user_ = await user.findByIdAndUpdate(req_user_._id, {
			$addToSet: {
				sharedDocuments: { documentId: docId, role: SCOPE.ALL },
			},
		});

		res.status(200).json({
			status: "success",
			message: `${req_user_?.name} , now has access to the document`,
		});
	}
);
