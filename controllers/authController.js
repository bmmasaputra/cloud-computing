import { authService } from "../services/authService.js";

export const authController = {
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const { accessToken, refreshToken } = await authService.signUp(
        name,
        email,
        password
      );

      res.status(201).json({
        success: true,
        message: "User created",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const { accessToken, refreshToken, user } = await authService.login(
        email,
        password
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
      }

      const newAccessToken = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Access token refreshed",
        accessToken: newAccessToken,
      });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  },
};
