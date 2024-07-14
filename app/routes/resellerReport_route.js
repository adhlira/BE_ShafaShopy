import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();
router.get("/allResellerReport", async (req, res) => {
  const result = await prisma.transactions.findMany({
    include: {
      Detail_Transaction: { select: { jumlah_beli: true } },
      Customer: { include: { Level: { select: { level: true } } } },
    },
    where: { customer_id: { not: 1 } },
  });
  res.status(200).json(result);
});
export default router;
