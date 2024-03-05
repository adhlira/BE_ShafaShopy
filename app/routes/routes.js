import { Router } from "express";
import productroute from "./product_route.js";
import categoryroute from "./category_route.js";

const router = Router();

router.use(productroute);
router.use(categoryroute);
export default router;
