import express, { Router } from "express";
import cors from "cors";
import nocache from "nocache";
import helmet from "helmet";
import userRouter from "./routes/userRouter";
import documentRouter from "./routes/documentRouter";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

const app = express();

// app.use(
// 	cors({
// 		credentials: true,
// 		origin: process.env.CLIENT_ORIGIN_URL,
// 	})
// );

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

// app.use((_, res, _2) => {
// 	res.contentType("application/json; charset-utf-8");
// });
app.use(nocache());

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN_URL,
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Authorization", "Content-Type"],
		maxAge: 86400,
		credentials: true,
	})
);

app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.json());

// routes ->

app.use("/api/v1/gdocs", userRouter);
app.use("/api/v1/gdocs", documentRouter);


export default app;
