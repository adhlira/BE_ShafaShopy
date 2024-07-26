import Router from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.get("/bestreseller", async (req, res) => {
  try {
    const results = await prisma.customers.findMany({
      where: {
        id: {
          not: 1,
        },
      },
      include: {
        Transactions: {
          include: {
            Detail_Transaction: true,
          },
        },
      },
    });

    // Calculate total sales for each customer
    const customerSales = results.map((customer) => {
      const total_penjualan = customer.Transactions.reduce((sum, transaction) => {
        const transactionSum = transaction.Detail_Transaction.reduce((subSum, detail) => subSum + detail.jumlah_beli, 0);
        return sum + transactionSum;
      }, 0);

      return {
        name: customer.name,
        total_penjualan: total_penjualan,
      };
    });

    // Sort by total sales in descending order
    const finalResults = customerSales.sort((a, b) => b.total_penjualan - a.total_penjualan);
    const limitedresult = finalResults.slice(0, 1);
    res.status(200).json(limitedresult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/bestSellingProduct", async (req, res) => {
  try {
    // Step 1: Group by product_id and sum jumlah_beli
    const groupedResults = await prisma.detail_Transaction.groupBy({
      by: ["transaction_id"],
      _sum: {
        jumlah_beli: true,
      },
    });

    // Step 2: Fetch product details including colors for each grouped result
    const productSales = await Promise.all(
      groupedResults.map(async (result) => {
        const transaction = await prisma.transactions.findUnique({
          where: {
            id: result.transaction_id,
          },
          include: {
            Product: {
              include: {
                ColorProduct: {
                  include: {
                    Color: true,
                  },
                },
              },
            },
          },
        });

        return {
          productName: transaction.Product.name,
          colorName: transaction.Product.ColorProduct.map((cp) => cp.Color.name).join(", "),
          totalTerjual: result._sum.jumlah_beli,
        };
      })
    );

    // Step 3: Aggregate results by productName and colorName
    const aggregatedResults = productSales.reduce((acc, current) => {
      const key = `${current.productName} - ${current.colorName}`;
      if (!acc[key]) {
        acc[key] = {
          productName: current.productName,
          colorName: current.colorName,
          totalTerjual: 0,
        };
      }
      acc[key].totalTerjual += current.totalTerjual;
      return acc;
    }, {});

    const finalResults = Object.values(aggregatedResults).sort((a, b) => b.totalTerjual - a.totalTerjual);
    const limitedresult = finalResults.slice(0, 1);
    res.json(limitedresult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/transactions", async (req, res) => {
  const results = await prisma.transactions.findMany({ include: { Product: { include: { Color: { select: { name: true } } } }, Detail_Transaction: { select: { jumlah_beli: true } } }, orderBy: { tanggal: "desc" } });
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

router.put("/transactions/:id", async (req, res) => {
  const { product_id, customer_id, tanggal, total, jumlah_beli, price_per_piece, subtotal } = req.body;
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const transaction = await prisma.transactions.findFirst({ where: { id: +req.params.id } });
    if (!transaction) {
      res.status(404).json({ message: "Transaction Not Found" });
    } else {
      const detail = await prisma.detail_Transaction.findUnique({ where: { transaction_id: +req.params.id } });
      const product = await prisma.product.findUnique({ where: { id: product_id } });
      if (product_id == transaction.product_id) {
        const updateData = await prisma.transactions.update({
          where: { id: +req.params.id },
          data: {
            product_id: product_id,
            customer_id: customer_id,
            tanggal: tanggal,
            total: total,
          },
        });
        if (jumlah_beli > detail.jumlah_beli) {
          await prisma.product.update({
            where: {
              id: product_id,
            },
            data: {
              stock: product.stock - (jumlah_beli - detail.jumlah_beli),
            },
          });
        } else {
          await prisma.product.update({
            where: {
              id: product_id,
            },
            data: {
              stock: product.stock + (detail.jumlah_beli - jumlah_beli),
            },
          });
        }
        await prisma.detail_Transaction.update({
          where: {
            transaction_id: +req.params.id,
          },
          data: {
            jumlah_beli: jumlah_beli,
            subtotal: subtotal,
            price_per_piece: price_per_piece,
          },
        });
        res.status(200).json({ message: "Transaction updated", updateData });
      } else {
        const updateData = await prisma.transactions.update({
          where: { id: +req.params.id },
          data: {
            product_id: product_id,
            customer_id: customer_id,
            tanggal: tanggal,
            total: total,
          },
        });
        await prisma.product.update({
          where: {
            id: product_id,
          },
          data: {
            stock: product.stock - jumlah_beli,
          },
        });
        await prisma.detail_Transaction.update({
          where: {
            transaction_id: +req.params.id,
          },
          data: {
            jumlah_beli: jumlah_beli,
            subtotal: subtotal,
            price_per_piece: price_per_piece,
          },
        });
        res.status(200).json({ message: "Transaction updataed", updateData });
      }
    }
  }
});

router.delete("/transactions/:id", async (req, res) => {
  await prisma.detail_Transaction.deleteMany({ where: { transaction_id: +req.params.id } });
  await prisma.transactions.delete({ where: { id: +req.params.id } });
  res.status(200).json({ message: "Transaction deleted" });
});

export default router;
