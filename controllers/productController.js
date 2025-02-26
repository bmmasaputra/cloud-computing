import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { productService } from "../services/productServices.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const productController = {
  async addProductToHistory(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is required" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const requiredFields = [
        "name",
        "grades_id",
        "calories",
        "protein",
        "fat",
        "fiber",
        "carbo",
        "sugar",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Missing fields: ${missingFields.join(", ")}`,
          });
      }

      const historyProduct = await productService.addProductToHistory(
        userId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: "Product successfully added to history.",
        historyProduct,
      });
    } catch (error) {
      const errorMessage =
        error.name === "JsonWebTokenError"
          ? "Invalid or expired token"
          : "Internal server error";
      res
        .status(500)
        .json({ success: false, message: errorMessage, error: error.message });
    }
  },

  async getAllProduct(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is required." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const userProducts = await productService.getAllProducts(userId);

      if (userProducts.length === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: "No products found for this user.",
          });
      }

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        userHistory: userProducts,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error.",
          error: error.message,
        });
    }
  },

  async getProductById(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    const { id } = req.params;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is required." });
    }

    try {
      const productDetails = await productService.getProductById(id);

      if (productDetails.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Product Not Found." });
      }

      res.status(200).json({
        success: true,
        message: "Product retrieved successfully.",
        productDetails,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error.",
          error: error.message,
        });
    }
  },
};
