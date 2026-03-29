import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import {verifyAccessToken}  from "../../middleware/verifyAccessToken.js";

const authRouter = Router();

/**
 * POST /api/auth/register
*/
authRouter.post("/register", authController.register);

/**
 * POST /api/auth/login
*/
authRouter.post("/login", authController.login);

/**
 * GET /api/auth/me
*/
authRouter.get("/get-me", verifyAccessToken, authController.getMe);

/**
 * POST /api/auth/refresh
*/
authRouter.post("/refresh", authController.refreshToken);

/**
 * POST /api/auth/logout
*/
authRouter.post("/logout",verifyAccessToken,authController.logout);

/**
 * POST /api/auth/logout-all
*/
authRouter.post("/logout-all",verifyAccessToken,authController.logoutAll);

/**
 * POST /api/auth/verify-email
*/
authRouter.post("/verify-email",authController.verifyEmail);

/**
 * POST /api/auth/request-new-otp
*/
authRouter.post("/new-otp",authController.requestAnotherOtp);

export default authRouter;