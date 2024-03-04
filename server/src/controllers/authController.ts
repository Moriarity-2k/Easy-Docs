import { jwtDecode } from "jwt-decode";
import user, { IUser } from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserOnRequest } from "../TypeHelpers/helpers";

const jwtSignInToken = function (id: string) {
	const token = jwt.sign({ id }, process.env.SECRET_STRING!, {
		expiresIn: "24d",
	});

	return token;
};

export const Login = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
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
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			status: "success",
			message: "Log In successfull",
			token,
			user: {
				name: user_db.name,
				email: user_db.email,
			},
		});
	}
);

export const signUp = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		// console.log(req.body);

		const created_user = (await user.create({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
		})) as IUser;

		const token = jwtSignInToken(created_user._id!.toString());

		res.cookie("jwt", token, {
			maxAge: 7 * 86400,
		});

		res.status(200).json({
			status: "success",
			message: "Sign Up successfull",
			token,
			user: {
				name: created_user.name,
				email: created_user.email,
			},
		});
	}
);

export const logout = catchAsync(
	async (req: UserOnRequest, res: Response, next: NextFunction) => {
		res.clearCookie("jwt");

		res.status(200).json({
			status: "success",
			message: "Logout successfull",
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
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.jwt) {
			token = req.cookies.jwt;
		}
		// console.log({ token });

		if (!token) {
			return res.status(401).json({
				status: "Please Login",
				message: "You have to login to perform this action !",
			});
		}

		const jwtString = jwt.verify(token, process.env.SECRET_STRING!);

		const decoded = jwtDecode<Decode>(token);

		// console.log({ decoded });

		// console.log(decoded.exp > Date.now());

		if (decoded.exp > Date.now()) {
			return res.status(401).json({
				status: "Unauthorized",
				message: "Login Expired ! Please sign in again to continue ..",
			});
		}

		const user_found = await user.findById(decoded.id);

		if (!user_found) {
			return res.status(404).json({
				status: "error",
				message: "User does not exist on DB",
			});
		}

		// console.log("Authenticate success");

		req.user_ = user_found as IUser;

		next();
	}
);
