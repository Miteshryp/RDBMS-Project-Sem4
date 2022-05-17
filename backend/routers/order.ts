import controller from "./../controllers/orders"
import express from "express"

const router = express.Router();

router.get("/", controller.getOrders);
router.post("/", controller.placeOrder);

export default router;