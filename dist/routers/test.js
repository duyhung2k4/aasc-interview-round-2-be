"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testRouter = (0, express_1.Router)();
testRouter.get("/ping", (req, res) => {
    res.status(200).json({
        mess: "done",
    });
});
exports.default = testRouter;
