import { Request } from "express";
import { IUser } from "../models/user.model";

export enum SCOPE {
	ADMIN,
	ALL,
	VIEW,
}

export interface UserOnRequest extends Request {
	user_?: IUser;
}
