import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/customers", async (req, res) => {
  const results = await prisma.customers.findMany({ include: { Level: { select: { level: true } } }, orderBy: { level_id: "asc" }, skip:1 });
  res.status(200).json(results);
});

router.get("/customers/:id", async (req, res) => {
  const customerId = parseInt(req.params.id);
  if (isNaN(customerId)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    try {
      const customer = await prisma.customers.findFirst({
        where: { id: customerId },
        include: { Level: { select: { level: true } } },
      });

      if (!customer) {
        res.status(404).json({ message: "Data Not Found" });
      } else {
        res.status(200).json(customer);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/customers", async (req, res) => {
  const { name, address, telp, level_id, status } = req.body;
  if (!name || !address || !telp || !status) {
    res.status(400).json({ message: "Data tidak lengkap" });
  } else {
    const customer = await prisma.customers.create({ data: { name, address, telp, level_id, status } });
    res.status(200).json({ message: "Berhasil menambahkan data customer", customer });
  }
});

router.put("/customers/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const customer = await prisma.customers.findFirst({ where: { id: +req.params.id } });
    if (!customer) {
      res.status(404).json({ message: "Data Not Found" });
    } else {
      const customer_updated = await prisma.customers.update({ where: { id: +req.params.id }, data: req.body });
      res.status(200).json({ message: "Customer updated", customer_updated });
    }
  }
});

router.delete("/customers/:id", async (req, res) => {
  await prisma.customers.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Data Customer deleted" });
});

export default router;
