import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});

router.post("/categories", async (req, res) => {
  const { name } = req.body;
  const duplikatCategory = await prisma.category.findFirst({ where: { name: req.body.name } });
  if (!req.body.name) {
    res.status(400).json({ message: "Data tidak lengkap" });
  } else if (duplikatCategory) {
    res.status(400).json({ message: "Nama category yang dimasukkan sudah ada" });
  } else {
    const category = await prisma.category.create({ data: { name } });
    res.status(200).json({ message: "Berhasil menambahkan data category", category });
  }
});

export default router;
