import { PrismaClient } from "@prisma/client";
import MarkdownIt from "markdown-it";

const prisma = new PrismaClient();
const md = new MarkdownIt();

const articleService = {
  async getAllArticles() {
    const articles = await prisma.article.findMany();
    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      author: article.author,
      content: md.render(article.content).replace(/\n/g, "<br>"),
      imgUrl: article.img_url,
      date: article.date,
    }));
  },

  async getArticleById(id) {
    const article = await prisma.article.findFirst({
      where: { id: parseInt(id, 10) },
    });

    if (!article) return null;

    return {
      id: article.id,
      title: article.title,
      description: article.description,
      author: article.author,
      content: md.render(article.content).replace(/\n/g, "<br>"),
      imgUrl: article.img_url,
      date: article.date,
    };
  },
};

export default articleService;
