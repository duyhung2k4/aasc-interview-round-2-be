"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const http_1 = __importDefault(require("../utils/http"));
const connect_1 = require("../config/connect");
const dayjs_1 = __importDefault(require("dayjs"));
const auth_1 = require("../services/auth");
class AuthMiddleware {
    httpUtils;
    clientRedis;
    authService;
    constructor() {
        this.clientRedis = connect_1.redisClient;
        this.httpUtils = new http_1.default();
        this.authService = new auth_1.AuthService();
        this.authToken = this.authToken.bind(this);
    }
    async authToken(req, res, next) {
        try {
            const token = req.query?.auth || null;
            if (!token) {
                this.httpUtils.UnAuthorization(res, new Error("not token in auth"));
                return;
            }
            const accessKey = await this.clientRedis.get(token);
            if (!accessKey) {
                this.httpUtils.UnAuthorization(res, new Error("token not exist"));
                return;
            }
            const tokenInfo = JSON.parse(accessKey);
            const isBefore = (0, dayjs_1.default)() < (0, dayjs_1.default)(tokenInfo.exp);
            if (isBefore) {
                next();
                return;
            }
            const newToken = await this.authService.getToken(token);
            if (newToken instanceof Error) {
                throw newToken;
            }
            req.query.auth = newToken;
            req.query.newToken = newToken;
            next();
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
