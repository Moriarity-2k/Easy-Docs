import { Router } from "express";
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
import document from "../models/document.model";

const router = Router();

router.route("/createNewDocument").post(authenticate, createDocument);

router.route("/documents/getAllDocuments").get(authenticate, getAllDocuments);

router.route("/document/askPermission").post(authenticate, getPermission);
router.route("/document/grantPermission").post(authenticate, grantPermission);

router.route("/document/getAccess/:id").get(authenticate, getAccess);

router.route("/document/search").get(async (req, res, next) => {
	const { title } = req.query;
	console.log({ title });

	const val = await document.find({ title });

	console.log("DOC NAME : ", val);

	if (val.length) {
		return res.status(200).json({
			message: "Document name already exists",
			ok: 0,
		});
	}

	return res.status(200).json({
		message: "success",
		ok: 1,
	});
});

router
	.route("/document/:id")
	.get(authenticate, getDocument)
	.post(authenticate, updateDocument)
	.delete(authenticate, deleteDocument);

export default router;
