import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/colors", async (req, res) => {
  const colors = await prisma.color.findMany();
  res.status(200).json(colors);
});

router.get("/colors/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "ID tidak ketahui" });
  } else {
    const color = await prisma.color.findFirst({ where: { id: +req.params.id } });
    if (!color) {
      res.status(404).json({ message: "ID tidak ditemukan" });
    } else {
      res.status(200).json(color);
    }
  }
});

router.post("/colors", async (req, res) => {
  const { name } = req.body;
  const duplikatColor = await prisma.color.findFirst({ where: { name: req.body.name } });
  if (!req.body.name) {
    res.status(400).json({ message: "Data incomplete" });
  } else if (duplikatColor) {
    res.status(400).json({ message: "Color name is exist" });
  } else {
    const color = await prisma.color.create({ data: { name } });
    res.status(200).json({ message: "Succesfully added data", color });
  }
});

router.put("/colors/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Unknown ID" });
  } else {
    const color = await prisma.color.findFirst({ where: { id: +req.params.id } });
    if (!color) {
      res.status(404).json({ message: "ID not found" });
    } else {
      const duplikatColor = await prisma.color.findFirst({ where: { name: req.body.name } });
      if (duplikatColor) {
        res.status(400).json("Color Name is exist");
      } else {
        const updatedColor = await prisma.color.update({ where: { id: +req.params.id }, data: req.body });
        res.status(200).json({ message: "Data updated succesfully", updatedColor });
      }
    }
  }
});

router.delete("/colors/:id", async (req, res) => {
  if (isNaN(+req.params.id)) {
    res.status(400).json({ message: "ID tidak diketahui" });
  } else {
    const color = await prisma.color.findFirst({ where: { id: +req.params.id } });
    if (!color) {
      res.status(404).json({ message: "ID tidak ditemukan" });
    } else {
      await prisma.color.delete({ where: { id: +req.params.id } });
      res.status(200).json({ message: "Data berhasil dihapus" });
    }
  }
});

export default router;
