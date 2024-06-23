import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/sellingprice", async (req, res) => {
  const results = await prisma.sellingPrice.findMany({
    include: {
      Product: { include: { Color: { select: { name: true } } } },
    },
  });
  res.status(200).json(results);
});

router.get("/newsellingprice", async (req, res) => {
  const results = await prisma.product.findMany({ where: { SellingPrice: { none: {} } } });
  res.status(200).json(results);
});

router.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    try {
      const product = await prisma.product.findFirst({
        where: { id: productId },
        include: {
          Category: { select: { name: true } },
          Color: { select: { name: true } },
          SellingPrice: { select: { price0: true, price1: true, price2: true, price3: true, price4: true, price5: true } },
        },
      });

      if (!product) {
        res.status(404).json({ message: "Product Not Found" });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/sellingprice", async (req, res) => {
  const { product_id, price0, price1, price2, price3, price4, price5 } = req.body;
  if (!req.body.name) {
    res.status(400).json({ message: "Data tidak lengkap" });
  } else {
    const sellingPrice = await prisma.sellingPrice.create({ data: { product_id, price0, price1, price2, price3, price4, price5 } });
    res.status(200).json({ message: "Berhasil menambahkan data baru", sellingPrice });
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
