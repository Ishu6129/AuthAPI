import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter=Router();


/**
 * POST /api/auth/register
 * @description Register a new user
 */
authRouter.post("/register",authController.register)

/**
 * POST /api/auth/get-me
 * @description Get the authenticated user's information
*/
authRouter.post("/get-me",authController.getMe)

/**
 * GET /api/auth/refresh-token
 * @description Refresh the access token using the refresh token
 */
authRouter.get("/refresh",authController.refreshToken)

/**
 * POST /api/auth/logout
 * @description Logout the user by revoking the refresh token
 */
authRouter.post("/logout",authController.logout)

export default authRouter;