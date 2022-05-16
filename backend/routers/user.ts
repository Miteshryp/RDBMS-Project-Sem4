import express from "express";
import controller from "./../controllers/user";
import auth from "./../middlewares/auth"

let router = express.Router();

router.get("/info", [auth.verifyUser], controller.getDetails);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);

export default router;