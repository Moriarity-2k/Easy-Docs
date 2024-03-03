import express, {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
	Router,
} from "express";
import cors from "cors";
import nocache from "nocache";
import helmet from "helmet";
import userRouter from "./routes/userRouter";
import documentRouter from "./routes/documentRouter";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import compression from "compression";
import xss from "xss-clean";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

const app = express();

app.use(compression());

app.use(
	helmet({
		hsts: {
			maxAge: 31536000,
		},
		contentSecurityPolicy: {
			useDefaults: false,
			directives: {
				"default-src": ["'none'"],
				"frame-ancestors": ["'none'"],
			},
		},
		frameguard: {
			action: "deny",
		},
	})
);

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(nocache());

app.use(
	cors({
		// origin: process.env.CLIENT_ORIGIN_URL,
		origin: '*',
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Authorization", "Content-Type"],
		maxAge: 86400,
		credentials: true,
	})
);

app.use(ExpressMongoSanitize());
app.use(xss());
app.use(cookieParser());
app.use(express.json());

// routes ->

app.use("/api/v1/gdocs", userRouter);
app.use("/api/v1/gdocs", documentRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.url} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
