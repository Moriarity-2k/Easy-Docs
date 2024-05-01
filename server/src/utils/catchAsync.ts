import { NextFunction, Response } from "express";
import { UserOnRequest } from "../TypeHelpers/helpers";

const catchAsync = (
	fn: (req: UserOnRequest, res: Response, next: NextFunction) => any
) => {
	return (req: UserOnRequest, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};

// const catchAsync = <T, P>(fn: (req: T, res: P, next: NextFunction) => {}) => {
// 	return (req: T, res: P, next: NextFunction) => {
// 		fn(req, res, next);
// 	};
// };

export default catchAsync;

// function A<T>(a: T) {
// 	console.log(a);
// }
//
// function B<T>(fn: (a: T) => void) {
// 	return (a: T) => {
// 		fn(a);
// 	};
// }
//
// const C = B(<T>(a: T) => {
// 	console.log(a);
// });
//
// C(4)
// C("asdf");
