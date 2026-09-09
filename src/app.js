import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware.js";
import helmet from "helmet";

const app=express();
app.use(helmet());

const allowedOrigins = [
	"https://auth-api-eight-roan.vercel.app",
	"http://localhost:5173"
];

app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	}
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())


app.use("/api/auth",authRouter);
app.use(errorHandler);
// app.set("trust proxy", 1); // if behind a proxy (e.g., Heroku, Nginx) for correct IP and secure cookies

export default app;