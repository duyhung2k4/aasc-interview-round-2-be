"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnect = exports.redisClient = exports.pgConnect = exports.pgClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const redis_1 = require("redis");
dotenv_1.default.config();
const pgClientConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD
};
exports.pgClient = new pg_1.Client(pgClientConfig);
const pgConnect = async () => {
    try {
        await exports.pgClient.connect();
        console.log("pg connected successfully!");
    }
    catch (error) {
        console.log(error);
    }
};
exports.pgConnect = pgConnect;
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
const redisConnect = async () => {
    try {
        await exports.redisClient.connect();
        console.log("redis connected successfully!");
    }
    catch (error) {
        console.log(error);
    }
};
exports.redisConnect = redisConnect;
