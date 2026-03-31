import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import validate from "../middleware/validate.js";
import {globalLimiter,authLimiter,loginLimiter,otpLimiter} from "../middleware/rateLimit.js";

const authRouter = Router();

authRouter.use(globalLimiter); // Global limiter applied to all

/**
 * POST /api/auth/register
*/
authRouter.post("/register",authLimiter,validate("register"),authController.register);

/**
 * POST /api/auth/login
*/
authRouter.post("/login",loginLimiter,validate("login"),authController.login);

/**
 * GET /api/auth/me
*/
authRouter.get("/get-me",verifyAccessToken,authController.getMe);

/**
 * POST /api/auth/refresh
*/
authRouter.post("/refresh",authLimiter,authController.refreshToken);

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
authRouter.post("/verify-email",otpLimiter,validate("verifyEmail"),authController.verifyEmail);

/**
 * POST /api/auth/request-new-otp
*/
authRouter.post("/new-otp",otpLimiter,validate("email"),authController.requestAnotherOtp);

/**
 * POST /api/auth/forgot-password
*/
authRouter.post("/forgot-password",authLimiter,validate("email"),authController.forgotPassword
);

/**
 * POST /api/auth/reset-password
*/
authRouter.post("/reset-password",authLimiter,validate("resetPassword"),authController.resetPassword);

export default authRouter;