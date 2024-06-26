import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/transactions", async (req, res) => {
  const results = await prisma.transactions.findMany({ include: { Product: { include: { Color: { select: { name: true } } } }, Detail_Transaction: { select: { jumlah_beli: true } } } });
  res.status(200).json(results);
});

router.get("/transactions/:id", async (req, res) => {
  const transaction_id = parseInt(req.params.id);
  if (isNaN(transaction_id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    try {
      const product = await prisma.transactions.findFirst({
        where: { id: transaction_id },
        include: {
          Detail_Transaction: { select: { jumlah_beli: true, price_per_piece: true } },
          Product: { include: { Color: { select: { name: true } }, SellingPrice: { select: { price0: true, price1: true, price2: true, price3: true, price4: true, price5: true } } } },
          Customer: { include: { Level: { select: { level: true } } } },
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

router.post("/transactions", async (req, res) => {
  const { product_id, customer_id, tanggal, total, jumlah_beli, price_per_piece, subtotal } = req.body;
  if (!product_id || !customer_id || !tanggal || !total || !jumlah_beli || !price_per_piece || !subtotal) {
    res.status(400).json({ message: "Data tidak lengkap" });
  } else {
    const product = await prisma.product.findUnique({ where: { id: product_id } });
    if (product.stock >= jumlah_beli) {
      const transaction = await prisma.transactions.create({ data: { product_id, customer_id, tanggal, total, Detail_Transaction: { create: { jumlah_beli, price_per_piece, subtotal } } } });
      await prisma.product.update({ where: { id: product_id }, data: { stock: product.stock - jumlah_beli } });
      res.status(200).json({ message: "Berhasil menambahkan data transaksi", transaction });
    } else {
      res.status(400).json({ message: "Stok product tidak mencukupi" });
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

router.delete("/transactions/:id", async (req, res) => {
  await prisma.detail_Transaction.deleteMany({ where: { transaction_id: +req.params.id } });
  await prisma.transactions.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Transaction deleted" });
});

export default router;
