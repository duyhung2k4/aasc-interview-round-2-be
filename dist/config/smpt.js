"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const emailTransporter = (0, nodemailer_1.createTransport)({
    service: 'gmail',
    auth: {
        user: "nguyenduyhung04092004@gmail.com",
        pass: "exrz crko utdb diob",
    }
});
exports.default = emailTransporter;
