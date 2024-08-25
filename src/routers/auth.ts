import { authController } from "../controllers/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/get-token", authController.getToken);

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/accept-code", authController.acceptCode);
authRouter.post("/install", authController.eventInstallApp);

export default authRouter;