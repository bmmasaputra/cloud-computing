import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function getUserData(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        const userId = decode.id;

        const user = await prisma.users.findMany({
            where: {
                id: userId,
            },
            include: {
                password: false,
                users_allergy: {
                    include: {
                        allergy: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "User data retrieved",
            user
        })
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
}