import { Router } from "express";
import productroute from "./product_route.js";
import categoryroute from "./category_route.js";
import colorroute from "./color_route.js";
import sellingpriceroute from "./sellingprice_route.js";

const router = Router();

router.use(productroute);
router.use(categoryroute);
router.use(colorroute);
router.use(sellingpriceroute);

export default router;
