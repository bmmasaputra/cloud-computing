import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import allergyRouter from "./routes/allergyRouter.js";
import userRouter from "./routes/userRouter.js";
import articleRouter from "./routes/articleRouter.js";

const app = express();

// Use Morgan for logging HTTP requests (using 'dev' format)
app.use(morgan("combined"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FITS! Your personal food advisor",
  });
});

// Auth routes
app.use("/api/v1", authRouter);

// User routes
app.use("/api/v1", userRouter);

// Product routes
app.use("/api/v1", productRouter);

// Allergy routes
app.use("/api/v1", allergyRouter);

// Articles
app.use("/api/v1", articleRouter)

export default app; // Exporting app for testing
