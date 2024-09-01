import SMTPTransport from "nodemailer/lib/smtp-transport";
import emailTransporter from "../config/smpt";
import HttpUtils from "../utils/http";
import EventEmitter from "events";
import emitter from "../config/emit";
import dayjs from "dayjs";

import { RegisterRequest, BitrixInstallRequest, AcceptCodeRequest, LoginRequest } from "../dto/request/auth";
import { AuthService } from "../services/auth";
import { Request, Response } from "express";
import { QueryUtils } from "../utils/query";
import { TimeModel } from "../models/time";
import { AppInfoResponse, LoginResponse, RegisterRepsone } from "../dto/response/auth";
import { Transporter } from "nodemailer";
import { RedisClientType } from "redis";
import { redisClient } from "../config/connect";
import { BitrixInfoRedis } from "../models/redis";



export class AuthController {
    private httpUtils: HttpUtils;
    private queryUtils: QueryUtils;
    private authService: AuthService;
    private emitter: EventEmitter;
    private emailTransporter: Transporter<SMTPTransport.SentMessageInfo>;
    private clientRedis: RedisClientType;


    constructor() {
        this.emitter = emitter;
        this.emailTransporter = emailTransporter;
        this.clientRedis = redisClient
        this.httpUtils = new HttpUtils();
        this.queryUtils = new QueryUtils();
        this.authService = new AuthService();

        this.eventInstallApp = this.eventInstallApp.bind(this);
        this.getToken = this.getToken.bind(this);
        this.register = this.register.bind(this);
        this.acceptCode = this.acceptCode.bind(this);
        this.login = this.login.bind(this);
    }

    async eventInstallApp(req: Request, res: Response) {
        try {
            const data = req.body as BitrixInstallRequest;
            console.log(data);
            const appInfoResult = await this.queryUtils.axiosBaseQuery<{ result: AppInfoResponse, time: TimeModel }>({
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
        } catch (error) {
            console.log(error);
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async register(req: Request, res: Response) {
        try {
            const data = req.body as RegisterRequest;
            const result = await this.authService.createAccpetCode(data);

            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            }

            const response: RegisterRepsone = {
                id_accept_code: result.id,
                expires: result.expires,
                expires_repeat_code: result.expires_repeat_code,
            }

            this.emailTransporter.sendMail({
                from: "AASC Accept code",
                to: data.email,
                html: `<h1>${result.code}</h1>`,
            });

            this.httpUtils.SuccessResponse(req, res, response);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async acceptCode(req: Request, res: Response) {
        try {
            const data = req.body as AcceptCodeRequest;
            const result = await this.authService.acceptCode(data);

            if (result instanceof Error) {
                throw new Error(JSON.stringify(result));
            }

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = req.body as LoginRequest;
            const result = await this.authService.login(data);

            if (result instanceof Error) {
                throw result;
            }

            if (!result.token) {
                throw new Error("token not found");
            }

            const access_token: string = result.token?.access_token;

            const responseData: LoginResponse = {
                access_token,
            }

            await this.clientRedis.set(access_token, JSON.stringify({
                bitrixUrl: result.client_endpoint,
                exp: dayjs.unix(Number(result.token.expires)).toDate(),
            } as BitrixInfoRedis))

            this.httpUtils.SuccessResponse(req, res, responseData);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }

    async getToken(req: Request, res: Response) {
        try {
            const result = {
                body: req.body,
                query: req.query,
            };

            this.httpUtils.SuccessResponse(req, res, result);
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const authController = new AuthController();