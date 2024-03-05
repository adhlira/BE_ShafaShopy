import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});

export default router;
