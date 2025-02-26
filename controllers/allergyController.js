import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import allergyService from "../services/allergyService.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const allergyController = {
  async getAllAllergy(req, res) {
    try {
      const allergy = await allergyService.getAllAllergy();
      res.status(200).json({ success: true, data: allergy });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
  },

  async setUserAllergy(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(401)
          .json({
            success: false,
            message: "Authorization token is required.",
          });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { data } = req.body;

      const result = await allergyService.setUserAllergy(decoded.id, data);
      res
        .status(201)
        .json({ success: true, message: "User allergy added", result });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  },

  async detectAllergy(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(401)
          .json({
            success: false,
            message: "Authorization token is required.",
          });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { ingredients } = req.body;

      const allergyContained = await allergyService.detectAllergy(
        decoded.id,
        ingredients
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Scanning allergy complete",
          allergyContained,
        });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  },

  async deleteUserAllergy(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(401)
          .json({
            success: false,
            message: "Authorization token is required.",
          });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = req.body;

      await allergyService.deleteUserAllergy(decoded.id, id);
      res.status(200).json({ success: true, message: "Allergy deleted" });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  },
};

export default allergyController;
