import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/customers", async (req, res) => {
  const results = await prisma.customers.findMany();
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

router.post("/products", async (req, res) => {
  const { category_id, color_id, name, purchase_price, stock, description } = req.body;
  if (!req.body.name) {
    res.status(400).json({ message: "Data tidak lengkap" });
  } else {
    const product = await prisma.product.create({ data: { category_id, color_id, name, purchase_price, stock, description, ColorProduct: { create: { color_id } } } });
    res.status(200).json({ message: "Berhasil menambahkan data product", product });
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
  await prisma.colorProduct.deleteMany({ where: { product_id: +req.params.id } });
  await prisma.product.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Product deleted" });
});

export default router;
