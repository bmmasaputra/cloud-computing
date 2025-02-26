import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userService from "../services/userServices.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userController = {
  async getUserData(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is required." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const user = await userService.getUserById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      res.status(200).json({
        success: true,
        message: "User data retrieved",
        user,
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

export default userController;
