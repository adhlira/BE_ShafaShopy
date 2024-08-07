import { Router } from "express";
import productroute from "./product_route.js";
import categoryroute from "./category_route.js";
import colorroute from "./color_route.js";
import sellingpriceroute from "./sellingprice_route.js";
import customerroute from "./customer_route.js";
import levelroute from "./level_route.js";
import transactionroute from "./transaction.js";
import resellerroute from "./resellerReport_route.js";
import loginroute from "./login_route.js"

const router = Router();

router.use(productroute);
router.use(categoryroute);
router.use(colorroute);
router.use(sellingpriceroute);
router.use(customerroute);
router.use(levelroute);
router.use(transactionroute);
router.use(resellerroute);
router.use(loginroute)

export default router;
