import { Router } from "express";
import { authenticate } from "../controllers/authController";
import {
	createDocument,
	deleteDocument,
	updateDocument,
} from "../controllers/documentController";
import user from "../models/user.model";
import { SCOPE } from "../TypeHelpers/helpers";
import { Types, Schema } from "mongoose";

const router = Router();

/**
 *
 * note: working : deletion
 */

router.route("/createNewDocument").post(authenticate, createDocument);

router
	.route("/document/:id")
	.post(authenticate, updateDocument)
	.delete(authenticate, deleteDocument);

export default router;
