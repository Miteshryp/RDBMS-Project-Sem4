import  express from "express";
import auth from "../middlewares/auth";

import controller from "../controllers/product";
const router = express.Router();

router.get("/get", controller.getProductList);
router.post("/create", controller.createProduct);

// router.post("/order", [auth.verifyUser], controller.placeOrder);

export default router;