import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export const productService = {
  async addProductToHistory(userId, productData) {
    const {
      name,
      grades_id,
      overall,
      health_assessment,
      calories,
      calories_ing,
      protein,
      protein_ing,
      fat,
      fat_ing,
      fiber,
      fiber_ing,
      carbo,
      carbo_ing,
      sugar,
      sugar_ing,
      allergy,
    } = productData;

    // Generate unique IDs
    const productId = nanoid();
    const historyId = nanoid();
    const createdAt = new Date();

    // Insert product into history
    const historyProduct = await prisma.history_product.create({
      data: {
        id: historyId,
        created_at: createdAt,
        users: { connect: { id: userId } },
        product: {
          create: {
            id: productId,
            name,
            grade: { connect: { id: grades_id } },
            overall,
            health_assessment,
            calories,
            calories_ing,
            protein,
            protein_ing,
            fat,
            fat_ing,
            fiber,
            fiber_ing,
            carbo,
            carbo_ing,
            sugar,
            sugar_ing,
          },
        },
      },
      include: { product: true },
    });

    // Insert allergens
    const insertDataAllergy = allergy.map((item) => ({
      id: nanoid(),
      product_id: historyProduct.product.id,
      allergy_id: item.allergy_id,
      allergen: item.allergen,
    }));

    await prisma.product_allergen.createMany({ data: insertDataAllergy });

    return historyProduct;
  },

  async getAllProducts(userId) {
    return await prisma.history_product.findMany({
      where: { users_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        product: {
          include: {
            grade: true,
            product_allergen: {
              include: { allergy: true },
            },
          },
        },
      },
    });
  },

  async getProductById(productId) {
    return await prisma.product.findMany({
      where: { id: productId },
      include: {
        history_product: true,
        grade: true,
        product_allergen: {
          include: { allergy: true },
        },
      },
    });
  },
};
