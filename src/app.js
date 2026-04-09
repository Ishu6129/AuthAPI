import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware.js";
import helmet from "helmet";

const app=express();
app.use(helmet());

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())


app.use("/api/auth",authRouter);
app.use(errorHandler);
// app.set("trust proxy", 1); // if behind a proxy (e.g., Heroku, Nginx) for correct IP and secure cookies

export default app;