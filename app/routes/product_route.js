import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/products", async (req, res) => {
  const results = await prisma.product.findMany();
  res.status(200).json(results);
});

router.get("/products/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product = await prisma.product.findFirst(
      {
        include: {
          Category: { select: { name: true } },
          Color: { select: { name: true } },
          SellingPrice: { select: { price0: true, price1: true, price2: true, price3: true, price4: true, price5: true } },
        },
      },
      { where: { id: +req.params.id } }
    );
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      res.status(200).json(product);
    }
  }
});

router.put("/products/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product = await prisma.product.findFirst({ where: { id: +req.params.id } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const product_updated = await prisma.product.update({ where: { id: +req.params.id }, data: req.body });
      res.status(200).json({ message: "Product updated", product_updated });
    }
  }
});

router.delete("/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Product deleted" });
});

export default router;
