import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function getAllAllergy(req, res) {
    try {        
        const allergy = await prisma.allergy.findMany({
            distinct: ['allergy_name'],
            select: {
                id: true,
                allergy_name: true
            }
        });

        res.status(200).json({
            success: true,
            data: allergy
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.name
        })
    } finally {
        await prisma.$disconnect();
    }
};

async function setUserAllergy(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const { data } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    if (!data) {
        return res.status(400).json({ success: false, message: 'All fields required'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const userAllergies = [];

        const usersAllergy = await prisma.users_allergy.findMany({
            where: {
                users_id: userId
            }
        })
        
        const allergyExists = usersAllergy.find(allergy => 
            data.find(element => allergy.allergy_id === element.id)
        );
        
        if (allergyExists) {
            return res.status(400).json({
                success: false,
                message: "Allergy already exists"
            });
        }

        data.forEach(element => {
            const data = {
                id: nanoid(),
                users_id: userId,
                allergy_id: element.id
            };

            userAllergies.push(data);
        });

        const insertUserAllergy = await prisma.users_allergy.createMany({
            data: userAllergies,
        });

        res.status(201).json({
            success: true,
            message: "User allergy added",
            insertUserAllergy
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

async function detectAllergy(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const { ingredients } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    if (!ingredients) {
        return res.status(400).json({ success: false, message: 'All fields required'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId =  decoded.id;
        const ingArr = ingredients.split(' ');

        const userAllergy = await prisma.users_allergy.findMany({
            where: {
                users_id: userId,
            },
            include: {
                allergy: {
                    select: {
                        allergy_name: true,
                    }
                }
            }
        });

        const allergyContained = await Promise.all(userAllergy.map(async element => {
            const allergies = await prisma.allergy.findMany({
                select: {
                    id: true,
                    allergy_name: true,
                    allergen: true
                },
                where: {
                    allergy_name: element.allergy.allergy_name,
                }
            });
        
            return allergies.filter(allergy =>
                ingArr.some(ingredient => allergy.allergen.toLowerCase() === ingredient.toLowerCase())
            );
        }));
        
        res.status(200).json({
            success: true,
            message: "Scanning allergy complete",
            allergyContained: allergyContained.flat()
        });
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

async function deleteUserAllergy(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    if (!id) {
        return res.status(400).json({ success: false, message: 'All fields required'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId =  decoded.id;

        const deleteAllergy = await prisma.users_allergy.deleteMany({
            where: {
                AND: [
                    {allergy_id: id},
                    {users_id: userId}
                ]
            }
        });

        res.status(200).json({
            success: true,
            message: "Allergy deleted"
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

export { getAllAllergy, setUserAllergy, detectAllergy, deleteUserAllergy };