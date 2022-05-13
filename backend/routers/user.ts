import express from "express";
import controller from "./../controllers/user";

let router = express.Router();

router.get("/info", controller.getDetails);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);

export default router;