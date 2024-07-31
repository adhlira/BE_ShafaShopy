import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/levels", async (req, res) => {
  const results = await prisma.level_Customer.findMany({ skip: 1 });
  res.status(200).json(results);
});

export default router;
