import express from "express";
import { authController } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/users", authController.signUp);
authRouter.post("/users/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
