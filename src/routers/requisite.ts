import { Router } from "express";
import { requisiteController } from "../controllers/requisite";

const requisiteRouter = Router();

requisiteRouter.post("/add", requisiteController.addRequisite);
requisiteRouter.put("/update", requisiteController.updateRequisite);
requisiteRouter.delete("/delete", requisiteController.deleteRequisite);

export default requisiteRouter;