import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const authService = {
  async signUp(name, email, password) {
    const existingUser = await prisma.users.findFirst({ where: { email } });

    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const id = nanoid();
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    const newUser = await prisma.users.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword,
        created_at: createdAt,
      },
    });

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    await prisma.users.update({
      where: { id: newUser.id },
      data: { token: accessToken, refresh_token: refreshToken },
    });

    return { accessToken, refreshToken };
  },

  async login(email, password) {
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "360d" }
    );

    await prisma.users.update({
      where: { id: user.id },
      data: { token: accessToken, refresh_token: refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    };
  },

  async refreshToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await prisma.users.findFirst({ where: { id: decoded.id } });

    if (!user || user.refresh_token !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.users.update({
      where: { id: user.id },
      data: { token: newAccessToken },
    });

    return newAccessToken;
  },
};
