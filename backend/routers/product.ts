import  express from "express";

import controller from "../controllers/product";
const router = express.Router();

router.get("/product:product_name", controller.getProduct);
router.post("/product", controller.createProduct);

router.post("/order", controller.placeOrder);

export default router;