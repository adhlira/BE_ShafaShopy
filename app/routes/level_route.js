import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/levels", async (req, res) => {
  const results = await prisma.level_Customer.findMany();
  res.status(200).json(results);
});

export default router;
