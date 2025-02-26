import { productService } from "../services/productServices.js"; // Adjust the path
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    history_product: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    product_allergen: {
      createMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock("nanoid", () => ({ nanoid: jest.fn(() => "mockedNanoId") }));

const prisma = new PrismaClient();

describe("productService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("addProductToHistory should create a history entry and add allergens", async () => {
    const userId = "user123";
    const productData = {
      name: "Test Product",
      grades_id: "grade123",
      overall: "A",
      health_assessment: "Healthy",
      calories: 100,
      calories_ing: "test",
      protein: 10,
      protein_ing: "test",
      fat: 5,
      fat_ing: "test",
      fiber: 3,
      fiber_ing: "test",
      carbo: 20,
      carbo_ing: "test",
      sugar: 2,
      sugar_ing: "test",
      allergy: [{ allergy_id: "allergy1", allergen: "Peanuts" }],
    };

    prisma.history_product.create.mockResolvedValue({
      id: "history123",
      created_at: new Date(),
      users_id: userId,
      product: { id: "mockedNanoId" },
    });

    prisma.product_allergen.createMany.mockResolvedValue({ count: 1 });

    const result = await productService.addProductToHistory(
      userId,
      productData
    );

    expect(prisma.history_product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          users: { connect: { id: userId } },
          product: expect.objectContaining({
            create: expect.objectContaining({
              name: "Test Product",
              grade: { connect: { id: "grade123" } },
            }),
          }),
        }),
      })
    );

    expect(prisma.product_allergen.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          product_id: "mockedNanoId",
          allergy_id: "allergy1",
          allergen: "Peanuts",
        }),
      ]),
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: "history123",
        product: expect.objectContaining({ id: "mockedNanoId" }),
      })
    );
  });

  test("getAllProducts should return a list of products", async () => {
    const userId = "user123";
    const mockProducts = [{ id: "product1" }, { id: "product2" }];

    prisma.history_product.findMany.mockResolvedValue(mockProducts);

    const result = await productService.getAllProducts(userId);

    expect(prisma.history_product.findMany).toHaveBeenCalledWith({
      where: { users_id: userId },
      orderBy: { created_at: "desc" },
      include: expect.any(Object),
    });

    expect(result).toEqual(mockProducts);
  });

  test("getProductById should return product details", async () => {
    const productId = "product1";
    const mockProduct = [{ id: productId, name: "Test Product" }];

    prisma.product.findMany.mockResolvedValue(mockProduct);

    const result = await productService.getProductById(productId);

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { id: productId },
      include: expect.any(Object),
    });

    expect(result).toEqual(mockProduct);
  });
});
