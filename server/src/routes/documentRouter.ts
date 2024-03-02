import { NextFunction, Response, Router } from "express";
import { authenticate } from "../controllers/authController";
import {
	createDocument,
	deleteDocument,
	getAccess,
	getAllDocuments,
	updateDocument,
} from "../controllers/documentController";
import user from "../models/user.model";
import { SCOPE, UserOnRequest } from "../TypeHelpers/helpers";
import { Types, Schema } from "mongoose";

const router = Router();

/**
 *
 * note: working : deletion
 */

router.route("/createNewDocument").post(authenticate, createDocument);

router.route("/documents/getAllDocuments").get(authenticate, getAllDocuments);

router
	.route("/document/:id")
	.get(authenticate, getAccess)
	.post(authenticate, updateDocument)
	.delete(authenticate, deleteDocument);

export default router;
