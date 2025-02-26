import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

// Get user data
userRouter.get("/users", userController.getUserData);

export default userRouter;
