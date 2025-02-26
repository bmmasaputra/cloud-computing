import express from "express";
import articleController from "../controllers/articleController.js";

const articleRouter = express.Router();

// Get all articles
articleRouter.get("/article/", articleController.getAllArticles);

// Get article by ID
articleRouter.get("/article/:id", articleController.getArticleById);

export default articleRouter;
