import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const allergyService = {
  async getAllAllergy() {
    return prisma.allergy.findMany({
      distinct: ["allergy_name"],
      select: {
        id: true,
        allergy_name: true,
      },
    });
  },

  async setUserAllergy(userId, data) {
    if (!data) throw { status: 400, message: "All fields required" };

    const usersAllergy = await prisma.users_allergy.findMany({
      where: { users_id: userId },
    });

    if (
      usersAllergy.some((allergy) =>
        data.some((element) => allergy.allergy_id === element.id)
      )
    ) {
      throw { status: 400, message: "Allergy already exists" };
    }

    const userAllergies = data.map((element) => ({
      id: nanoid(),
      users_id: userId,
      allergy_id: element.id,
    }));

    return prisma.users_allergy.createMany({ data: userAllergies });
  },

  async detectAllergy(userId, ingredients) {
    if (!ingredients) throw { status: 400, message: "All fields required" };

    const ingArr = ingredients.split(" ");

    const userAllergy = await prisma.users_allergy.findMany({
      where: { users_id: userId },
      include: { allergy: { select: { allergy_name: true } } },
    });

    const allergyContained = await Promise.all(
      userAllergy.map(async (element) => {
        const allergies = await prisma.allergy.findMany({
          select: { id: true, allergy_name: true, allergen: true },
          where: { allergy_name: element.allergy.allergy_name },
        });

        return allergies.filter((allergy) =>
          ingArr.some(
            (ingredient) =>
              allergy.allergen.toLowerCase() === ingredient.toLowerCase()
          )
        );
      })
    );

    return allergyContained.flat();
  },

  async deleteUserAllergy(userId, ids) {
    if (!ids) throw { status: 400, message: "All fields required" };

    await Promise.all(
      ids.map(async (id) => {
        await prisma.users_allergy.deleteMany({
          where: { AND: [{ allergy_id: id }, { users_id: userId }] },
        });
      })
    );
  },
};

export default allergyService;
