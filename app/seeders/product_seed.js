import prisma from "../helper/prisma.js";
import {faker} from "@faker-js/faker";

const main = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      await prisma.product.create({
        data: {
          category_id: faker.number.int({ min: 1, max: 4 }),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          purchase_price: parseFloat(faker.commerce.price({ min: 10, max: 50 })),
          sellingprice0: parseFloat(faker.commerce.price({ min: 140, max: 150 })),
          sellingprice1: parseFloat(faker.commerce.price({ min: 130, max: 140 })),
          sellingprice2: parseFloat(faker.commerce.price({ min: 120, max: 130 })),
          sellingprice3: parseFloat(faker.commerce.price({ min: 110, max: 120 })),
          sellingprice4: parseFloat(faker.commerce.price({ min: 100, max: 110 })),
          sellingprice5: parseFloat(faker.commerce.price({ min: 90, max: 100 })),
          stock: 100,
        },
      });
    }
  } catch (error) {}
};

main().catch((e) => {
     throw e;
   });
