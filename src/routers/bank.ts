import { Router } from "express";
import { bankController } from "../controllers/bank";

const bankRouter = Router();

bankRouter.get("/list", bankController.listBank);
bankRouter.post("/add", bankController.addBank);
bankRouter.put("/update", bankController.updateBank);
bankRouter.delete("/delete", bankController.deleteBank);

export default bankRouter;