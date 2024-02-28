import { Document, Schema, model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";
import { SCOPE } from "../TypeHelpers/helpers";

export interface IUser extends Document {
	email: string;
	password: string;
	name?: string;
	active: boolean;
	// sharedDocuments: { documentId: Schema.Types.ObjectId; role: SCOPE }[];
	sharedDocuments: { documentId: string; role: SCOPE }[];
	// sharedDocuments: {}[];
	_id?: Schema.Types.ObjectId;
}

/**
 *
 * OWNER -> the one that creates and only admin can delete
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
	//
	// },
	name: {
		type: String,
		required: true,
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
});

userScehma.pre("save", async function (this, next) {
	if (!this.isModified("password")) next();

	this.password = await bcrypt.hash(this.password, 11);
	// this.sharedDocuments = [];

	next();
});

const user = model("user", userScehma);

export default user;
