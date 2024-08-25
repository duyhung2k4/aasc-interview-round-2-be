import { Router } from "express";
import { contactController } from "../controllers/contact";

const contactRouter = Router();

contactRouter.get("/test", contactController.test);

export default contactRouter;