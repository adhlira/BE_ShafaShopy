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
    res.status(400).json({ message: "Data incomplete" });
  } else if (duplikatCategory) {
    res.status(400).json({ message: "Category Name is exist" });
  } else {
    const category = await prisma.category.create({ data: { name } });
    res.status(200).json({ message: "successfully added category data", category });
  }
});

router.put("/categories/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "ID unknown" });
  } else {
    const category = await prisma.category.findFirst({ where: { id: +req.params.id } });
    if (!category) {
      res.status(404).json({ message: "ID not found" });
    } else {
      const duplikatCategory = await prisma.category.findFirst({ where: { name: req.body.name } });
      if (duplikatCategory) {
        res.status(400).json("Category Name is Exist");
      } else {
        const updatedCategory = await prisma.category.update({ where: { id: +req.params.id }, data: req.body });
        res.status(200).json({ message: "Data updated succesfully", updatedCategory });
      }
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
