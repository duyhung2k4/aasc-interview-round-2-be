import { RedisClientType } from "redis";
import HttpUtils from "../utils/http";
import { Request, Response } from "express";
import { redisClient } from "../config/connect";
import { BitrixInfoRedis } from "../models/redis";
import dayjs from "dayjs";
import { AuthService } from "../services/auth";

export class AuthMiddleware {
    private httpUtils: HttpUtils;
    private clientRedis: RedisClientType;
    private authService: AuthService;

    constructor() {
        this.clientRedis = redisClient;
        this.httpUtils = new HttpUtils();
        this.authService = new AuthService();

        this.authToken = this.authToken.bind(this);
    }

    async authToken(req: Request, res: Response, next: (error?: Error | any) => void) {
        try {
            const token = (req.query?.auth as string) || null;

            if(!token) {
                this.httpUtils.UnAuthorization(res, new Error("not token in auth"));
                return;
            }

            const accessKey = await this.clientRedis.get(token);
            
            if(!accessKey) {
                this.httpUtils.UnAuthorization(res, new Error("token not exist"));
                return;
            }

            
            const tokenInfo: BitrixInfoRedis = JSON.parse(accessKey);
            const isBefore = dayjs() < dayjs(tokenInfo.exp);


            // const urlGetToken = await this.authService.getRefreshToken(token);
            // if (urlGetToken instanceof Error) {
            //     throw urlGetToken;
            // }
            // req.query.urlGetToken = urlGetToken;

            
            if(isBefore) {
                next();
                return;
            }
            
            const newToken = await this.authService.getToken(token);
            if(newToken instanceof Error) {
                const urlGetToken = await this.authService.getRefreshToken(token);
                if(urlGetToken instanceof Error) {
                    throw urlGetToken;
                }
                req.query.urlGetToken = urlGetToken;
                
                this.httpUtils.SuccessResponse(req, res, {});
                return;
            }




            req.query.auth = newToken;
            req.query.newToken = newToken;


            next();
        } catch (error) {
            this.httpUtils.ErrorResponse(res, new Error(JSON.stringify(error)));
        }
    }
}

export const authMiddleware = new AuthMiddleware();