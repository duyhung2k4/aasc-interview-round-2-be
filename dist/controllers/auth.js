"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const smpt_1 = __importDefault(require("../config/smpt"));
const http_1 = __importDefault(require("../utils/http"));
const emit_1 = __importDefault(require("../config/emit"));
const dayjs_1 = __importDefault(require("dayjs"));
const auth_1 = require("../services/auth");
const query_1 = require("../utils/query");
const connect_1 = require("../config/connect");
class AuthController {
    httpUtils;
    queryUtils;
    authService;
    emitter;
    emailTransporter;
    clientRedis;
    constructor() {
        this.emitter = emit_1.default;
        this.emailTransporter = smpt_1.default;
        this.clientRedis = connect_1.redisClient;
        this.httpUtils = new http_1.default();
        this.queryUtils = new query_1.QueryUtils();
        this.authService = new auth_1.AuthService();
        this.eventInstallApp = this.eventInstallApp.bind(this);
        this.getToken = this.getToken.bind(this);
        this.register = this.register.bind(this);
        this.acceptCode = this.acceptCode.bind(this);
        this.login = this.login.bind(this);
    }
    async eventInstallApp(req, res) {
        try {
            const data = req.body;
            console.log(data);
            const appInfoResult = await this.queryUtils.axiosBaseQuery({
                baseUrl: data["auth[client_endpoint]"],
                data: {
                    url: "app.info",
                    method: "GET",
                    params: {
                        auth: data["auth[access_token]"],
                    }
                }
            });
            if (appInfoResult instanceof Error) {
                throw new Error(JSON.stringify(appInfoResult));
            }
            const result = await this.authService.installApp(data, appInfoResult.result.CODE);
            this.emitter.emit("save_accept_code", data["auth[access_token]"]);
            this.httpUtils.SuccessResponse(req, res, result);
        }
        catch (error) {
            console.log(error);
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async register(req, res) {
        try {
            const data = req.body;
            const result = await this.authService.createAcceptCode(data);
            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            }
            const response = {
                id_accept_code: result.id,
                expires: result.expires,
                expires_repeat_code: result.expires_repeat_code,
            };
            this.emailTransporter.sendMail({
                from: "AASC Accept code",
                to: data.email,
                html: `<h1>${result.code}</h1>`,
            });
            this.httpUtils.SuccessResponse(req, res, response);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async acceptCode(req, res) {
        try {
            const data = req.body;
            const result = await this.authService.acceptCode(data);
            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            }
            this.httpUtils.SuccessResponse(req, res, result);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            const result = await this.authService.login(data);
            if (result instanceof Error) {
                throw result;
            }
            if (!result.token) {
                throw new Error("token not found");
            }
            const access_token = result.token?.access_token;
            const responseData = {
                access_token,
            };
            await this.clientRedis.set(access_token, JSON.stringify({
                bitrixUrl: result.client_endpoint,
                exp: dayjs_1.default.unix(Number(result.token.expires)).toDate(),
            }));
            this.httpUtils.SuccessResponse(req, res, responseData);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
    async getToken(req, res) {
        try {
            const result = {
                body: req.body,
                query: req.query,
            };
            this.httpUtils.SuccessResponse(req, res, result);
        }
        catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
