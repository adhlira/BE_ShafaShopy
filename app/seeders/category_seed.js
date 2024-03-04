import prisma from "../helper/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    for (let i = 0; i < 4; i++) {
      await prisma.category.create({
        data: {
          name: faker.commerce.productMaterial(),
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

main().catch((e) => {
  throw e;
});
