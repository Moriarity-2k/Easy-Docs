import { NextFunction, Response, Router } from "express";
import { authenticate } from "../controllers/authController";
import {
	createDocument,
	deleteDocument,
	getAccess,
	getAllDocuments,
	getDocument,
	getPermission,
	grantPermission,
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

router.route("/document/askPermission").post(authenticate, getPermission);
router.route("/document/grantPermission").post(authenticate, grantPermission);

router.route("/document/getAccess/:id").get(authenticate, getAccess);

router
	.route("/document/:id")
    .get(authenticate , getDocument)
	.post(authenticate, updateDocument)
	.delete(authenticate, deleteDocument);

export default router;
