import { Router } from "express";
import productroute from "./product_route.js";

const router = Router();

router.use(productroute);
export default router;
