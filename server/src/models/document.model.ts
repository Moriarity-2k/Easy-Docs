import { Document, Schema, model } from "mongoose";
import { SCOPE } from "../TypeHelpers/helpers";
import slugify from "slugify";

export interface IDocument extends Document {
	title: string;
	content?: string;
	_id?: Schema.Types.ObjectId;
	isPublic: boolean;
	// access: { userId: Schema.Types.ObjectId; scope: SCOPE }[];
	slug: string;
	adminId: Schema.Types.ObjectId;
	createdOn: Date;
}

const documentSchema = new Schema<IDocument>(
	{
		title: { type: String, required: true, unique: true },
		content: { type: String, default: "" },
		isPublic: { type: Boolean, default: true },
		// access: {}[],
		slug: String,
		adminId: {
			type: Schema.Types.ObjectId,
			required: [true, "Every document must belong to a user"],
		},
		createdOn: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

documentSchema.pre("save", function (this, next) {
	this.slug = slugify(this.title);
	next();
});

const document = model<IDocument>("document", documentSchema);

export default document;
