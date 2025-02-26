import express from "express";
import allergyController from "../controllers/allergyController.js";

const allergyRouter = express.Router();

// Get all available allergies
allergyRouter.get("/allergy", allergyController.getAllAllergy);

// Set user allergies
allergyRouter.post("/users/allergy", allergyController.setUserAllergy);

// Detect allergens from ingredients
allergyRouter.post("/product/allergy", allergyController.detectAllergy);

// Delete user allergies
allergyRouter.delete("/users/allergy", allergyController.deleteUserAllergy);

export default allergyRouter;
