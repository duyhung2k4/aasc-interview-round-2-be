"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const init = async () => {
    try {
        await (0, connect_1.pgConnect)();
        await (0, connect_1.redisConnect)();
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = init;
