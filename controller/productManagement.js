import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function addProductToHistory(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Extract data from the request body
        const { 
            name,
            grades_id, 
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
            sugar_ing 
        } = req.body;
        
        // Validate required fields
        if (!name || !grades_id || !calories || !protein || !fat || !fiber || !carbo || !sugar) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
        }

        // Generate unique IDs
        const productId = nanoid();
        const historyId = nanoid();
        const createdAt = new Date();

        // Insert data into `product` and link it to `history_product`
        const historyProduct = await prisma.history_product.create({
            data: {
                id: historyId,
                created_at: createdAt,
                users: {
                    connect: {
                        id: userId, // Link the user by their ID
                    },
                },
                product: {
                    create: {
                        id: productId,
                        name,
                        grade: {
                            connect: {
                                id: grades_id
                            }
                        },
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
            include: {
                product: true, // Include product data in the response
            },
        });

        // Return the success response
        res.status(201).json({
            success: true,
            message: 'Product successfully added to history.',
            historyProduct,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
}

async function getAllProduct(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Fetch all products related to the user
        const userProducts = await prisma.history_product.findMany({
            where: {
                users_id: userId, // Filter by the user's ID
            },
            include: {
                product: true, // Include the product details
            },
        });

        if (userProducts.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this user.' });
        }

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully.',
            products: userProducts,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
}

async function getProductById(params) {
    const { }
}

export { addProductToHistory, getAllProduct };