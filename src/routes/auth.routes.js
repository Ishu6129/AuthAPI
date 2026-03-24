import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter=Router();


/**
 * POST /api/auth/register
 * @description Register a new user
 */
authRouter.post("/register",authController.register)

export default authRouter;