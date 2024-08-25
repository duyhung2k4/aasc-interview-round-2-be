import { Router } from "express";
import authRouter from "./auth";
import testRouter from "./test";
import contactRouter from "./contact";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use("/test", testRouter);
router.use("/auth", authRouter);
router.use("/contact", authMiddleware.authToken, contactRouter);

export default router;