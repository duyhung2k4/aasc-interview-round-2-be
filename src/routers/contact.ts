import { Router } from "express";
import { contactController } from "../controllers/contact";

const contactRouter = Router();

contactRouter.get("/test", contactController.test);
contactRouter.get("/list", contactController.listContact);
contactRouter.post("/add", contactController.addContact);
contactRouter.put("/update", contactController.updateContact);
contactRouter.delete("/delete", contactController.deleteContact);

export default contactRouter;