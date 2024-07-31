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
  const results = await prisma.product.findMany({ where: { SellingPrice: { none: {} } }, include: { Color: { select: { name: true } } } });
  res.status(200).json(results);
});

router.get("/sellingprice/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    try {
      const sellingPrice = await prisma.sellingPrice.findFirst({
        where: { id: id },
        include: {
          Product: { include: { Color: { select: { name: true } } } },
        },
      });

      if (!sellingPrice) {
        res.status(404).json({ message: "Data Not Found" });
      } else {
        res.status(200).json(sellingPrice);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/sellingprice", async (req, res) => {
  const { product_id, price0, price1, price2, price3, price4, price5 } = req.body;
  if (!req.body.product_id || !req.body.price0 || !req.body.price1 || !req.body.price2 || !req.body.price3 || !req.body.price4 || !req.body.price5) {
    res.status(400).json({ message: "Data incomplete" });
  } else {
    const sellingPrice = await prisma.sellingPrice.create({ data: { product_id, price0, price1, price2, price3, price4, price5 } });
    res.status(200).json({ message: "Added Data Succesfully", sellingPrice });
  }
});

router.put("/sellingprice/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const sellingPrice = await prisma.sellingPrice.findFirst({ where: { id: +req.params.id } });
    if (!sellingPrice) {
      res.status(404).json({ message: "Data Not Found" });
    } else {
      const sellingPriceUpdated = await prisma.sellingPrice.update({ where: { id: +req.params.id }, data: req.body });
      res.status(200).json({ message: "Data updated", sellingPriceUpdated });
    }
  }
});

router.delete("/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Product deleted" });
});

export default router;
