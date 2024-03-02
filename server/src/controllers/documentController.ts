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
			.select("title createdOn slug");

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

export const getAccess = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const id = req.params.id;

		const doc_ = await document.findById(id);

		console.log("GET ACCESS : ");

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
		console.log({ query_string: req.params });
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
