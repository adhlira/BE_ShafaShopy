import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});

router.get("/categories/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "ID tidak ketahui" });
  } else {
    const category = await prisma.category.findFirst({ where: { id: +req.params.id } });
    if (!category) {
      res.status(404).json({ message: "ID tidak ditemukan" });
    } else {
      res.status(200).json(category);
    }
  }
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

router.get("/categories/:name", async (req, res) => {
  const { categoryName } = req.query;
  try {
    const checkName = await prisma.category.findUnique({ where: { name: categoryName } });
    if (checkName) {
      res.status(200).json(checkName);
    } else {
      res.status(200).json({ message: "Data kosong" });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/categories/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "ID tidak ketahui" });
  } else {
    const category = await prisma.category.findFirst({ where: { id: +req.params.id } });
    if (!category) {
      res.status(404).json({ message: "ID tidak ditemukan" });
    } else {
      const updatedCategory = await prisma.category.update({ where: { id: +req.params.id }, data: req.body });
      res.status(200).json({ message: "Data berhasil di perbarui", updatedCategory });
    }
  }
});

router.delete("/categories/:id", async (req, res) => {
  if (isNaN(+req.params.id)) {
    res.status(400).json({ message: "ID tidak diketahui" });
  } else {
    const category = await prisma.category.findFirst({ where: { id: +req.params.id } });
    if (!category) {
      res.status(404).json({ message: "ID tidak ditemukan" });
    } else {
      await prisma.category.delete({ where: { id: +req.params.id } });
      res.status(200).json({ message: "Data berhasil dihapus" });
    }
  }
});

export default router;
