"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requisite_1 = require("../controllers/requisite");
const requisiteRouter = (0, express_1.Router)();
requisiteRouter.get("/list", requisite_1.requisiteController.listRequisite);
requisiteRouter.post("/add", requisite_1.requisiteController.addRequisite);
requisiteRouter.put("/update", requisite_1.requisiteController.updateRequisite);
requisiteRouter.delete("/delete", requisite_1.requisiteController.deleteRequisite);
exports.default = requisiteRouter;
