"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmptUtils = void 0;
const nodemailer_1 = require("nodemailer");
class SmptUtils {
    emailTransporter;
    constructor() {
        this.emailTransporter = (0, nodemailer_1.createTransport)({
            service: 'gmail',
            auth: {
                user: "nguyenduyhung04092004@gmail.com",
                pass: "exrz crko utdb diob",
            }
        });
    }
    GetEmailTransporter() {
        return this.emailTransporter;
    }
}
exports.SmptUtils = SmptUtils;
