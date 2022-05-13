import controller from "./../controllers/orders"
import express from "express"

const router = express.Router();

router.get("/", controller.getOrders);

export default router;