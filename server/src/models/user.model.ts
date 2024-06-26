import { Document, Schema, model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";
import { SCOPE } from "../TypeHelpers/helpers";

export interface IUser extends Document {
	email: string;
	password: string;
	name?: string;
	active: boolean;
	sharedDocuments: { documentId: string; role: SCOPE }[];
	// sharedDocuments: {}[];
	_id?: Schema.Types.ObjectId;
	AccessPermission: {
		userId: Schema.Types.ObjectId;
		docId: Schema.Types.ObjectId;
	}[];
}

/**
 *
 *
 * PUBLIC -> Anyone can view
 * PRIVATE -> People only he shares with using (email)
 * (
 *      with Email and access and update sharedDoc (working but )
 *      bug:
 * )
 */

const userScehma = new Schema<IUser>({
	// _id: {
	// },
	name: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		validate: [isEmail, "Please provide a valid email"],
		unique: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	password: {
		type: String,
		required: true,
		min: 4,
	},
	sharedDocuments: {
		type: [{}],
	},
	AccessPermission: {
		type: [{ userId: Schema.Types.ObjectId, docId: Schema.Types.ObjectId }],
	},
});

userScehma.pre("save", async function (this, next) {
	if (!this.isModified("password")) next();

	this.password = await bcrypt.hash(this.password, 11);
	// this.sharedDocuments = [];

	next();
});

const user = model("user", userScehma);

export default user;
