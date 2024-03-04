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
    const product = await prisma.product.findFirst({ where: { id: +req.params.id } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      res.status(200).json(product);
    }
  }
});

export default router;
