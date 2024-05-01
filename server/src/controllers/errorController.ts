import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

const handleCastErrorDB = (err: IErrorDefault | any) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: IErrorDefault) => {
	const value = err?.errmsg?.match(/(["'])(\\?.)*?\1/)![0];
	// console.log(value);

	const message = `Document Name Already Exists ${
		value !== undefined ? " : " + value : ""
	}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err: IErrorDefault) => {
	const errors = Object.values(err.errors!).map((el: any) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
	new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: IErrorDefault, req: Request, res: Response) => {
	console.log({ err });
	if (req.originalUrl.startsWith("/api")) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	console.error("ERROR 💥", err);
	return res.status(err.statusCode).render("error", {
		title: "Something went wrong!",
		msg: err.message,
	});
};

const sendErrorProd = (err: IErrorDefault, req: Request, res: Response) => {
	if (req.originalUrl.startsWith("/api")) {
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		console.error("ERROR 💥", err);
		return res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}

	if (err.isOperational) {
		console.log(err);
		return res.status(err.statusCode).render("error", {
			title: "Something went wrong!",
			msg: err.message,
		});
	}
	console.error("ERROR 💥", err);
	return res.status(err.statusCode).render("error", {
		title: "Something went wrong!",
		msg: "Please try again later.",
	});
};

interface IErrorDefault extends AppError {
	code?: number;
	errmsg?: string;
	errors?: {};
}

export default (
	err: IErrorDefault,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	console.log("DEVELOPMENT : ", err.code);

	// if (process.env.NODE_ENV === "development") {
	// 	sendErrorDev(err, req, res);
	// } else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;

		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError();
		if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendErrorProd(error, req, res);
	// }
};
