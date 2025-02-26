import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userService = {
  async getUserById(userId) {
    return prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        users_allergy: {
          include: {
            allergy: true,
          },
        },
      },
    });
  },
};

export default userService;
