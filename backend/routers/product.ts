import  express from "express";
import auth from "../middlewares/auth";

import controller from "../controllers/product";
const router = express.Router();

router.get("/product:product_name", controller.getProduct);
router.post("/product", controller.createProduct);

router.post("/order", [auth.verifyUser], controller.placeOrder);

export default router;