import { Router } from "express";
import authRouter from "./auth";
import testRouter from "./test";

const router = Router();

router.use("/test", testRouter);
router.use("/auth", authRouter);

export default router;