import { Router } from "express";
import prisma from "../helper/prisma.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.admin.findFirst({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    } else {
      if (password !== user.password) {
        return res.status(400).json({ message: "Password wrong" });
      }
    }
    return res.status(200).json({ message: "Login succces", user });
  } catch (error) {
    return res.status(500).json({ message: "An occured on Server" });
  }
});

export default router;
