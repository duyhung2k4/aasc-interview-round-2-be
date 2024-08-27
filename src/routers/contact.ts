import { Router } from "express";
import { contactController } from "../controllers/contact";

const contactRouter = Router();

contactRouter.get("/test", contactController.test);
contactRouter.post("/add", contactController.addContact);

export default contactRouter;