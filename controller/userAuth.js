import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

const prisma =  new PrismaClient();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

async function signUp(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({success: false, message: 'All fields are required'});
    }

    try {
        const existingUser = await prisma.users.findFirst({
            where: {email}
        });

        if (existingUser) {
            return res.status(400).json({success: false, message: 'Email is already registered.'});
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
                created_at: createdAt
            },
        });

        // Generate JWT token
        const accessToken = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
            expiresIn: '7d', // Set token expiration as needed
        });
        const refreshToken = jwt.sign({ id: newUser.id, email: newUser.email }, REFRESH_TOKEN_SECRET, {
            expiresIn: '30d', // Set token expiration as needed
        });

        await prisma.users.update({
            where: { id: newUser.id },
            data: { token: accessToken, refresh_token: refreshToken },
        });

        res.status(201).json({
            success: true,
            message: 'User created',
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Internal server error',
            error
        })
    } finally {
        await prisma.$disconnect();
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Find user by email
        const user = await prisma.users.findFirst({
            where: { email }
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '30d', // Set token expiration as needed
        });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, {
            expiresIn: '360d', // Set token expiration as needed
        });

        // Update user token in database
        await prisma.users.update({
            where: { id: user.id },
            data: { token: accessToken, refresh_token: refreshToken },
        });

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: userData
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.name
        });
    } finally {
        await prisma.$disconnect()
    }
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    // Validate the refresh token
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Find the user by ID
        const user = await prisma.users.findFirst({
            where: { id: decoded.id },
        });

        if (!user || user.refresh_token !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d', // Short-lived token
        });

        // Update user token in database
        await prisma.users.update({
            where: { id: user.id },
            data: { token: newAccessToken},
        });

        res.status(200).json({
            success: true,
            message: 'Access token refreshed',
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ success: false, message: 'Invalid refresh token' });
    } finally {
        await prisma.$disconnect();
    }
}

export { signUp, login, refreshToken };