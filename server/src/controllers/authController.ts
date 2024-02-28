import { jwtDecode } from "jwt-decode";
import user, { IUser } from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserOnRequest } from "../TypeHelpers/helpers";

const jwtSignInToken = function (id: string) {
	const token = jwt.sign({ id }, process.env.SECRET_STRING!, {
		expiresIn: 24 * 60 * 60,
	});

	return token;
};

export const Login = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		console.log(req.body);

		const user_db = (await user.findOne({
			email: req.body.email,
		})) as IUser;

		if (!user_db) {
			return res.status(404).json({
				status: "Not Found",
				message: "User Not Found",
			});
		}

		const user_accept = await bcrypt.compare(
			req.body.password,
			user_db.password
		);

		if (!user_accept) {
			return res.status(401).json({
				status: "error",
				message: "Either email or password is wrong ! Try again",
			});
		}

		const token = jwtSignInToken(user_db._id!.toString());

		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60,
		});

		res.status(200).json({
			status: "success",
			message: "Log In successfull",
			// token,
		});
	}
);

export const signUp = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		console.log(req.body);

		const created_user = (await user.create({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
		})) as IUser;

		const token = jwtSignInToken(created_user._id!.toString());

		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			status: "success",
			message: "Sign Up successfull",
			// token,
		});
	}
);

interface Decode {
	id: string;
	exp: number;
	iat: number;
}

export const authenticate = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		const { jwt: jwt_token } = req.cookies;

		if (!jwt_token) {
			res.json(401).json({
				status: "Please Login",
				message: "You have to login to perform this action !",
			});
            return;
		}

		const jwtString = jwt.verify(jwt_token, process.env.SECRET_STRING!);

		const decoded = jwtDecode<Decode>(jwt_token);
		console.log(decoded.exp > Date.now());

		if (decoded.exp > Date.now()) {
			return res.status(401).json({
				status: "Unauthorized",
				message: "Login Expired ! Please sign in again to continue ..",
			});
		}

		const user_found = await user.findById(decoded.id);

		if (!user_found) {
			return res.json(404).json({
				status: "error",
				message: "User does not exist on DB",
			});
		}

		req.user_ = user_found as IUser;

		next();
	}
);
