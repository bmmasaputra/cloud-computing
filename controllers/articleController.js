import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import articleService from "../services/articleService.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const articleController = {
  async getAllArticles(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization required" });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      const articles = await articleService.getAllArticles();

      res.status(200).json({
        success: true,
        message: "Articles retrieved successfully",
        articles,
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  async getArticleById(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    const { id } = req.params;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization required" });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      const article = await articleService.getArticleById(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Article retrieved successfully",
        article,
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default articleController;
