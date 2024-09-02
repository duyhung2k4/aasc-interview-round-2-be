"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const test_1 = __importDefault(require("./test"));
const contact_1 = __importDefault(require("./contact"));
const requisite_1 = __importDefault(require("./requisite"));
const bank_1 = __importDefault(require("./bank"));
const express_1 = require("express");
const auth_2 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use("/test", test_1.default);
router.use("/auth", auth_1.default);
router.use("/contact", auth_2.authMiddleware.authToken, contact_1.default);
router.use("/requisite", auth_2.authMiddleware.authToken, requisite_1.default);
router.use("/bank", auth_2.authMiddleware.authToken, bank_1.default);
exports.default = router;
