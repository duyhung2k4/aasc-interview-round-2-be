import authRouter from "./auth";
import testRouter from "./test";
import contactRouter from "./contact";
import requisiteRouter from "./requisite";
import bankRouter from "./bank";

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";



const router = Router();

router.use("/test", testRouter);
router.use("/auth", authRouter);
router.use("/contact", authMiddleware.authToken, contactRouter);
router.use("/requisite", authMiddleware.authToken, requisiteRouter);
router.use("/bank", authMiddleware.authToken, bankRouter);

export default router;