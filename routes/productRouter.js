import express from "express";
import { productController } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/products", productController.addProductToHistory);
productRouter.get("/products", productController.getAllProduct);
productRouter.get("/product/:id", productController.getProductById);

export default productRouter;
