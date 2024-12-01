import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import MarkdownIt from 'markdown-it';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const md = new MarkdownIt();

async function getAllArticle(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization required"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const articles = await prisma.article.findMany();
        const formatedArticles = [];

        articles.forEach(article => {
            const formatedArticle = {
                id: article.id,
                title: article.title,
                author: article.author,
                content: md.render(article.content).replaceAll(/\n/g, '<br>'),
                img_url: article.img_url,
                date: article.date
            };

            formatedArticles.push(formatedArticle);
        });

        res.status(200).json({
            success: true,
            message: "Article retrieved successfully",
            formatedArticles
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

async function getArticleById(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;

    if (!token) {
        return res.status(401).json({success: false, massage: "Authorization required"});
    }
    
    try {
        const decode = jwt.verify(token, JWT_SECRET);

        const article = await prisma.article.findFirst({
            where: {
                id: parseInt(id, 10),
            },
        });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Article found",
            article
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

export { getAllArticle, getArticleById };