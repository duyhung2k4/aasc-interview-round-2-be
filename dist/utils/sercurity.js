"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SercurityUtils = void 0;
const bcryptjs_1 = require("bcryptjs");
class SercurityUtils {
    hashPassword(password) {
        const salt = (0, bcryptjs_1.genSaltSync)(14);
        const hashString = (0, bcryptjs_1.hashSync)(password, salt);
        return hashString;
    }
    async comparePassword(password, passwordHash) {
        try {
            const result = await (0, bcryptjs_1.compare)(password, passwordHash);
            return result;
        }
        catch (error) {
            return new Error(JSON.stringify(error));
        }
    }
    generateRandomSixDigitString() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
exports.SercurityUtils = SercurityUtils;
